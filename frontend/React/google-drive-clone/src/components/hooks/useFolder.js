import { doc, getDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { useReducer, useEffect } from 'react'
import { database, firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

const ACTIONS = {
    SELECT_FOLDER: 'select-folder',
    UPDATE_FOLDER: 'update-folder',
    SET_CHILD_FOLDERS: 'set-child-folders',
}

const ROOT_FOLDER = { name: 'root', id: null, path: [] }

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: []
            }
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders
            }
        default:
            return state
    }
}

export function useFolder(folderId = null, folder = null) {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: []
    })
    const { currentUser } = useAuth()

    useEffect(() => {
        dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folder, folderId } })
    }, [folder, folderId])


    useEffect(() => {
        if (folderId == null) {
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }

        const docRef = doc(firestore, "folders", folderId)
        const docSnap = getDoc(docRef)
        docSnap.then(doc => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: database.formatDoc(doc) }
            })
        })
            .catch(() => {
                dispatch({
                    type: ACTIONS.UPDATE_FOLDER,
                    payload: { folder: ROOT_FOLDER }
                })
            })


    }, [folderId])

    useEffect(() => {
        const q = query(database.folders,
            where('parentId', '==', folderId),
            where('userId', '==', currentUser.uid),
            orderBy("createdAt")
        )
        return onSnapshot(q, (snapshot) => {
            dispatch({
                type: ACTIONS.SET_CHILD_FOLDERS,
                payload: { childFolders: snapshot.docs.map(doc => database.formatDoc(doc)) }
            })
        })
    }, [folderId, currentUser])


    return state
}
