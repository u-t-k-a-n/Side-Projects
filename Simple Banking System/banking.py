import random
import sqlite3

conn=sqlite3.connect("card.s3db")
cur=conn.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS card (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                number TEXT,
                pin TEXT,
                balance INTEGER DEFAULT 0)""")
conn.commit()

def Luhn(acc_num):
    sum_acc=0

    for i in range(0, 16, 2):
        if int(acc_num[i]) * 2 > 9:
            sum_acc += (int(acc_num[i]) * 2) - 9
        else:
            sum_acc += (int(acc_num[i]) * 2)

    for i in range(1, 16, 2):
        sum_acc += int(acc_num[i])

    return True if sum_acc%10==0 else False

def create_acc():
    acc_num="400000"
    acc_num+=str(random.randint(100000000,999999999))
    sum_acc=0
    checksum=0
    
    for i in range(0,15,2):
        if int(acc_num[i])*2>9:
            sum_acc+= (int(acc_num[i])*2)-9
        else:
            sum_acc+=(int(acc_num[i])*2)
        
    for i in range(1,15,2):
        sum_acc+=int(acc_num[i])
            
    while (sum_acc+checksum)%10!=0:
        checksum+=1
        
    acc_num+=str(checksum)
    pin_no= str(random.randint(0, 9)) + str(random.randint(0, 9)) + str(random.randint(0, 9)) + str(random.randint(0, 9))


    cur.execute("""SELECT number
                    FROM card
                    WHERE number={};""".format(acc_num))

    if len(cur.fetchall())==0:
        cur.execute("""INSERT INTO card (number,pin) VALUES ({},{})""".format(acc_num,pin_no))
        conn.commit()

    else:
        create_acc()
    
    return acc_num,pin_no
    
def login():
    
    log_acc_num=input("Enter your card number:\n")
    log_pin=input("Enter your PIN:\n")
    print("\n")

    cur.execute("""SELECT number,pin
                    FROM card
                    WHERE number={} AND pin={}""".format(log_acc_num,log_pin))


    if len(cur.fetchall())==0:
        print("Wrong card number or PIN!")
        return 1
        
    else:
        print("You have successfully logged in!\n")
        cur.execute("""SELECT balance 
                                FROM card
                                 WHERE number={}""".format(log_acc_num))

        balance = cur.fetchone()[0]
        log_order=-1
        while log_order!=0:
            print("""1. Balance
2. Add income
3. Do transfer
4. Close account
5. Log out
0. Exit""")
            log_order=int(input())

            if log_order==1:
                print("Balance:",balance)

            elif log_order==2:
                print("Enter income:")
                income=int(input())
                cur.execute("""SELECT balance 
                                FROM card
                                WHERE number={}""".format(log_acc_num))
                income+=cur.fetchone()[0]

                cur.execute("""UPDATE card SET balance={} WHERE number={}""".format(income,log_acc_num))
                conn.commit()
                print("Income was added!")

            elif log_order==3:
                print("""Transfer
Enter card number:""")
                trans_card_no=input()
                cur.execute("SELECT number "
                            "FROM card "
                            "WHERE number={}".format(trans_card_no))

                if trans_card_no==log_acc_num:
                    print("You can't transfer money to the same account!")

                elif Luhn(trans_card_no)==False:
                    print("Probably you made mistake in the card number. Please try again!")

                elif len(cur.fetchall())==0:
                    print("Such a card does not exist.")


                else:
                    print("Enter how much money you want to transfer:")
                    trans_money=int(input())

                    cur.execute("""SELECT *
                                    FROM card
                                     WHERE balance>={} and number={}""".format(trans_money,log_acc_num))

                    if len(cur.fetchall())==0:
                        print("Not enough money!")

                    else:
                        cur.execute("""SELECT balance 
                                        FROM card
                                        WHERE number={}""".format(trans_card_no))
                        trans_balance=trans_money+cur.fetchone()[0]

                        cur.execute("""UPDATE card
                                        SET balance={}
                                        WHERE number={}""".format(trans_balance,trans_card_no))
                        conn.commit()

                        cur.execute("""SELECT balance 
                                        FROM card 
                                        WHERE number={}""".format(log_acc_num))

                        sender_balance=cur.fetchone()[0]-trans_money

                        cur.execute("""UPDATE card
                                        SET balance={}
                                        WHERE number={}""".format(sender_balance,log_acc_num))
                        conn.commit()
                        print("Success!")

            elif log_order==4:
                cur.execute("""DELETE FROM card WHERE number={}""".format(log_acc_num))
                conn.commit()
                print("The account has been closed!")
                return 1

            elif log_order==5:
                print("You have successfully logged out!")
                return 1
            
        if log_order==0:
            print("Bye!")         
            return 0
            


def menu():
    order=-1

    while order!=0:
        
        print("""1. Create an account
2. Log into account
0. Exit""")

        order=int(input(""))
        print("\n")
        
        if order==1:
            acc_num,pin=create_acc()
            print("Your card has been created")
            print("Your card number:")
            print(acc_num)
            print("Your card PIN:")
            print(pin)
            print("\n")
            
        elif order==2:
            log=login()
            if log==0:
                order=0
    
    if order==0:
        print("Bye!")
            
menu()
conn.close()
            
    
