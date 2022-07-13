from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import sys
from PyQt5.uic import loadUiType
import psycopg2
import hashlib



ui, _ = loadUiType('LanguageSchool.ui')

class MainApp(QMainWindow, ui):
    def __init__(self):
        super(MainApp, self).__init__()
        self.setupUi(self)

        self.tabWidget.setCurrentIndex(4)
        self.tabWidget.tabBar().setVisible(False)
        self.menuBar().setVisible(False)

        self.b31.clicked.connect(self.show_admin_tab)
        self.b32.clicked.connect(self.show_registration_login)
        self.b41.clicked.connect(self.admin_login)
        self.b51.clicked.connect(self.save_new_branch)

        self.b01.clicked.connect(self.login)

        self.menu11.triggered.connect(self.show_add_new_student_tab)
        self.b11.clicked.connect(self.add_new_student)
        self.menu21.triggered.connect(self.show_payment_tab)
        self.b21.clicked.connect(self.make_payment)
        self.b22.clicked.connect(self.show_remaining_payments)

    def show_registration_login(self):
        self.tabWidget.setCurrentIndex(0)

    def show_admin_tab(self):
        self.tabWidget.setCurrentIndex(5)

    def admin_login(self):
        username = self.tb41.text()
        password = self.tb42.text()

        if username == 'admin' and password == 'admin':
            self.tabWidget.setCurrentIndex(6)
        
        else:
            QMessageBox().warning(self, 'Login', 'Invalid username or password')

    def save_new_branch(self):
        QMessageBox().information(self, 'Save New Branch', 'Branch added successfully.')

    def login(self):
        username = self.tb01.text()
        password = self.tb02.text()

        if Login(username, password).is_valid():
            self.menuBar().setVisible(True)
            self.tabWidget.setCurrentIndex(1)
        
        else:
            QMessageBox().warning(self, 'Login', 'Invalid username or password')

    def show_add_new_student_tab(self):
        self.tabWidget.setCurrentIndex(2)

    def add_new_student(self):
        fullname = self.tb11.text()
        home_number = self.tb12.text()
        business_number = self.tb13.text()
        course = self.cb11.currentText()
        level = self.cb12.currentText()
        payment = self.cb13.currentText()

        if len(fullname) == 0:
            QMessageBox().warning(self, 'Add New Student', 'Please fill the fullname field.')
        else:
            student_id = Student(fullname, home_number, business_number, course, level, payment).add_new_student()
            QMessageBox().information(self, 'Add New Student', 'Student added successfully. Student ID: {}'.format(student_id))



    def show_payment_tab(self):
        self.tabWidget.setCurrentIndex(3)
    
    def make_payment(self):
        student_id = self.tb21.text()
        payment_method = self.cb21.currentText()

        if len(student_id) == 0:
            QMessageBox().warning(self, 'Make Payment', 'Please fill the student ID field.')

        try:
            student_id = int(student_id)
            if student_id < 1:
                QMessageBox().warning(self, 'Make Payment', 'Invalid student ID.')
                return False
        except:
            QMessageBox().warning(self, 'Make Payment', 'Invalid student ID.')
            return False

        else:
            
            if Payment(student_id, payment_method).accept_payment():
                QMessageBox().information(self, 'Make Payment', 'Payment made successfully.')

            else:
                QMessageBox().warning(self, 'Make Payment', 'Incorret information entry.')

    def show_remaining_payments(self):

        student_id = self.tb21.text()
        payment_method = self.cb21.currentText()

        if len(student_id) == 0:
            QMessageBox().warning(self, 'Make Payment', 'Please fill the student ID field.')

        try:
            student_id = int(student_id)
            if student_id < 1:
                QMessageBox().warning(self, 'Make Payment', 'Invalid student ID.')
                return False            
        except:
                QMessageBox().warning(self, 'Make Payment', 'Invalid student ID.')
                return False
       
        else:

            remaining_payments = Payment(student_id, payment_method).get_remaining_payments()
            self.tb22.setText(str(remaining_payments[0]))
            self.tb23.setText(str(remaining_payments[1]))


class Payment:
    def __init__(self, student_id, payment_method):
        self.__student_id = int(student_id)
        self.__payment_method = payment_method
        self.__db_payment_method = Student(self.__student_id).get_payment_method()
        self.__course_price = Student(self.__student_id).get_course_price()
        self.__paid_amount = Student(self.__student_id).get_paid_amount()

    def is_valid(self):

        if (self.__payment_method == self.__db_payment_method == "Cash" or 
            self.__payment_method == self.__db_payment_method[2:13] == "Installment" or
            self.__payment_method == self.__db_payment_method[3:14] == "Installment") and self.__paid_amount < self.__course_price:
            return True
        else:
            return False

    def get_remaining_payments(self):
        if self.is_valid():
           
            if self.__payment_method == "Cash":
                payment_amount = self.__course_price
                return (1,payment_amount)

            else:
                if self.__db_payment_method[:2] == "12":
                    payment_amount = self.__course_price / int(self.__db_payment_method[:2])
                else:
                    payment_amount = self.__course_price / int(self.__db_payment_method[0])

                return ((self.__course_price - self.__paid_amount) // payment_amount, payment_amount)
        return (0,0)
        
    def accept_payment(self):
        if self.is_valid():
            if self.__payment_method == "Cash":
                payment_amount = self.__course_price
            elif self.__db_payment_method[:2] == "12":
                    payment_amount = self.__course_price / int(self.__db_payment_method[:2])
            else:
                    payment_amount = self.__course_price / int(self.__db_payment_method[0])

            
            db = DBAccess()
            db.connect()
            is_paid = db.call_function('accept_payment', self.__student_id, payment_amount)
            db.disconnect()
            return is_paid
        else:
            return False


class Student:
    def __init__(self, *args):
        if len(args) == 6:
            self.__fullname = str(args[0])
            self.__home_number = str(args[1])
            self.__business_number = str(args[2])
            self.__course = str(args[3])
            self.__level = str(args[4])
            self.__payment = str(args[5])
        else:
            self.__student_id = int(args[0])

    def add_new_student(self):
        db = DBAccess()
        db.connect()
        student_id = db.call_function('save_student', self.__fullname, self.__home_number, 
                                 self.__business_number, self.__course, self.__level, self.__payment)[0][0]
        db.disconnect() 
        return student_id            
    
    def get_paid_amount(self):
        db = DBAccess()
        db.connect()
        amount = db.call_function('get_paid_amount', self.__student_id)[0][0]
        db.disconnect()
        return 0 if amount is None else amount

    def get_course_price(self):
        db = DBAccess()
        db.connect()
        price = db.call_function('get_course_price', self.__student_id)[0][0]
        db.disconnect()
        return price

    def get_payment_method(self):
        db = DBAccess()
        db.connect()
        method = db.call_function('get_payment_method', self.__student_id)[0][0]
        db.disconnect()
        return method


class Login:
    def __init__(self, username, password):
        self.__username = username
        self.__password = password
        self.__db_password_hash = RegistrationStaff(username).get_password_hash()
        self.__password_hash = Hashing(self.__password).get_password_hash()

    def is_valid(self):
        if self.__password_hash == self.__db_password_hash:
            return True
        return False   
        

class Hashing:
    def __init__(self, password):
        self.__password = password
        self.__password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

    def get_password_hash(self):
        return self.__password_hash

class DBAccess:
    def __init__(self):
        self.__conn = None
        self.__cursor = None

    def connect(self):
        try:
            self.conn = psycopg2.connect(user="postgres",
                                         password="909605",
                                         host="127.0.0.1",
                                         port="5433",
                                         database="LanguageSchool")
            self.conn.autocommit = True
            self.cursor = self.conn.cursor()
            return True
        except:
            return False
    
    def disconnect(self):
        if self.conn:
            self.conn.close()
            self.conn = None
            self.cursor = None

    def call_function(self, name, *args):
        if self.conn:
            self.cursor.callproc(name, args)
            return self.cursor.fetchall()
        return None

class RegistrationStaff:
    def __init__(self,username):
        self.__username = username
        self.__db = DBAccess()
        self.__db.connect()
        self.__password_hash = self.__db.call_function('get_password_hash', self.__username)[0][0]
        self.__db.disconnect()

    def get_password_hash(self):
        return self.__password_hash


def main():
    app = QApplication(sys.argv)
    window = MainApp()
    window.show()
    app.exec_()



if __name__ == '__main__':
    main()