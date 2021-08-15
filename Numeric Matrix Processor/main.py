def matrix_add(a, b):
    if len(a) != len(b) or len(a[0]) != len(b[0]):
        return "ERROR"

    for i in range(len(a)):
        for j in range(len(a[0])):
            a[i][j] += b[i][j]

    return a


def scalar_matrix(a, x):
    for i in range(len(a)):
        for j in range(len(a[0])):
            a[i][j] *= x

    return a


def multi_matrix(a, b):
    if len(a[0]) != len(b):
        return "ERROR"

    c = []
    for i in range(len(a)):
        row = []
        for j in range(len(b[0])):
            row.append(0)
        c.append(row)

    for i in range(len(a)):
        for j in range(len(b[0])):
            for k in range(len(b)):
                c[i][j] += a[i][k] * b[k][j]

    return c


def create_trans_b(a):
    b = []
    for i in range(len(a[0])):
        row = []
        for j in range(len(a)):
            row.append(0)
        b.append(row)
    return b


def main_trans(a):
    b = create_trans_b(a)

    for i in range(len(a)):  # column
        for j in range(len(a[0])):  # row
            b[j][i] = a[i][j]

    return b


def side_trans(a):
    b = create_trans_b(a)

    for i in range(len(a)):  # column
        for j in range(len(a[0])):  # row
            b[j][i] = a[len(a) - i - 1][len(a[0]) - j - 1]

    return b


def vertical_trans(a):
    for i in range(len(a)):
        a[i] = a[i][::-1]

    return a


def horiz_trans(a):
    for i in range(len(a) // 2):
        a[i], a[len(a) - i - 1] = a[len(a) - i - 1], a[i]

    return a


def upp_triang(a):
    for i in range(len(a) - 1):
        for j in range(i + 1, len(a)):

            if a[i][i] == 0:
                a[i][:], a[i + 1][:] = a[i + 1][:], a[i][:]

                if a[i][i] == 0:
                    a[i][:], a[i - 1][:] = a[i - 1][:], a[i][:]

                for k in range(len(a)):
                    a[i][k] *= -1

            num = a[j][i] / a[i][i]

            for k in range(len(a)):
                a[j][k] -= num * a[i][k]
    return a


def determinant(a):
    if len(a) == 1:
        return a[0][0]
    else:
        upp_triang(a)
        det = 1
        for i in range(len(a)):
            det *= a[i][i]
    return det if int(det) != det else int(det)


def inverse(a):
    det = determinant(a)
    if det == 0:
        return "ERROR"

    n = len(a)
    identity = n * [n * [0]]

    for i in range(n):
        identity[i][i] = 1

    for i in range(n):
        num = a[i][i]

        for j in range(n):
            a[i][j] /= num
            identity[i][j] /= num

        for j in range(i + 1, n):
            for k in range(n):
                a[j][k] -= a[i][k]
                identity[j][k] -= identity[i][k]

    return identity


def menu():
    order = 8

    while order != 0:
        print("""1. Add matrices
2. Multiply matrix by a constant
3. Multiply matrices
4. Transpose matrix
5. Calculate a determinant
6. Inverse matrix
0. Exit""")
        order = int(input("Your choice:"))

        if order == 1:
            a = []
            b = []
            row_a, col_a = map(int, input("Enter size of first matrix:").split())
            print("Enter first matrix:")

            for i in range(row_a):
                a.append(list(map(float, input().split())))

            row_b, col_b = map(int, input("Enter size of second matrix:").split())
            print("Enter second matrix:")

            for i in range(row_b):
                b.append(list(map(float, input().split())))

            add_result = matrix_add(a, b)

            if add_result == "ERROR":
                print("The operation cannot be performed.")

            else:
                print("The result is:")
                for i in range(row_a):
                    print(*add_result[i])

        elif order == 2:
            a = []
            row_a, col_a = map(int, input("Enter size of matrix:").split())
            print("Enter matrix:")

            for i in range(row_a):
                a.append(list(map(float, input().split())))

            scalar = float(input("Enter constant:"))
            scalar = scalar_matrix(a, scalar)
            print("The result is:")
            for i in range(row_a):
                print(*scalar[i])

        elif order == 3:
            a = []
            b = []
            row_a, col_a = map(int, input("Enter size of first matrix:").split())
            print("Enter first matrix:")

            for i in range(row_a):
                a.append(list(map(float, input().split())))

            row_b, col_b = map(int, input("Enter size of second matrix:").split())
            print("Enter second matrix:")

            for i in range(row_b):
                b.append(list(map(float, input().split())))

            multi = multi_matrix(a, b)

            if multi == "ERROR":
                print("The operation cannot be performed.")

            else:
                print("The result is:")
                for i in range(len(multi)):
                    print(*multi[i])

        elif order == 4:
            print("""1. Main diagonal
2. Side diagonal
3. Vertical line
4. Horizontal line""")
            trans_order = int(input("Your choice:"))
            a = []
            row_a, col_a = map(int, input("Enter size of matrix:").split())
            print("Enter matrix:")

            for i in range(row_a):
                a.append(list(map(float, input().split())))

            if trans_order == 1:
                b = main_trans(a)

            elif trans_order == 2:
                b = side_trans(a)

            elif trans_order == 3:
                b = vertical_trans(a)

            elif trans_order == 4:
                b = horiz_trans(a)

            for i in range(len(b)):
                print(*b[i])

        elif order == 5:
            a = []
            row_a, col_a = map(int, input("Enter size of matrix:").split())
            print("Enter matrix:")

            for i in range(row_a):
                a.append(list(map(float, input().split())))

            print(determinant(a))

        elif order == 6:
            a = []
            row_a, col_a = map(int, input("Enter size of matrix:").split())
            print("Enter matrix:")

            for i in range(row_a):
                a.append(list(map(float, input().split())))

            inverse_matrix = inverse(a)

            if inverse_matrix == "ERROR":
                print("This matrix doesn't have an inverse.")

            else:
                for i in range(len(a)):
                    print(*inverse_matrix[i])


menu()








