import React, { useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage"


const BUDGET_APP_BUDGET_KEY = "budget-app-budgets"
const BUDGET_APP_EXPENSES_KEY = "budget-app-expenses"
const BudgetsContext = React.createContext({})

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export function useBudgets() {
    return useContext(BudgetsContext)

}

export const BudgetsProvider = ({ children }) => {
    const [budgets, setBudgets] = useLocalStorage(BUDGET_APP_BUDGET_KEY, [])
    const [expenses, setExpenses] = useLocalStorage(BUDGET_APP_EXPENSES_KEY, [])

    function getBudgetExpenses(budgetId) {
        return expenses.filter(expense => expense.budgetId === budgetId)
    }

    function addBudget({ name, maxAmount }) {
        setBudgets(prevBudgets => {
            if (prevBudgets.find(budget => budget.name === name)) {
                return prevBudgets
            }
            return [...prevBudgets, { id: uuidv4(), name, maxAmount }]
        })
    }

    function addExpense({ description, amount, budgetId }) {
        setExpenses(prevExpenses => {
            return [...prevExpenses, { id: uuidv4(), description, amount, budgetId }]
        })
    }

    function deleteBudget({ id }) {
        setExpenses(prevExpenses => {
            return prevExpenses.map(expense => {
                if (expense.budgetId !== id) {
                    return expense
                }
                return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID }
            })
        })

        setBudgets(prevBudgets => {
            return prevBudgets.filter(budget => budget.id !== id)
        })
    }

    function deleteExpense({ id }) {
        setExpenses(prevExpenses => {
            return prevExpenses.filter(expense => expense.id !== id)
        })
    }

    return (
        <BudgetsContext.Provider value={{
            budgets,
            expenses,
            getBudgetExpenses,
            addBudget,
            addExpense,
            deleteBudget,
            deleteExpense
        }}>
            {children}
        </BudgetsContext.Provider>
    )

}