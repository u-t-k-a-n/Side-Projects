import unittest
from LanguageSchool import *

class UnitTests(unittest.TestCase):
    def test_1(self):
        self.assertEqual(Login("","").is_valid(), False)

    def test_2(self):
        self.assertEqual(Login("","tom").is_valid(), False)

    def test_3(self):
        self.assertEqual(Login("tom","").is_valid(), False)

    def test_4(self):
        self.assertEqual(Login("tom","tom").is_valid(), True)
    
    def test_5(self):
        self.assertEqual(Login("tom","TOM").is_valid(), False)

    def test_6(self):
        self.assertEqual(Student(1).get_course_price(), 12000)

    def test_7(self):
        self.assertEqual(Student(1).get_payment_method(), "Cash")

    def test_8(self):
        self.assertEqual(Payment(1, "Cash").get_remaining_payments(), (0, 0))

    def test_9(self):
        self.assertEqual(Payment(1, "Cash").is_valid(), False)

    def test_10(self):
        self.assertEqual(Payment(1, "Installment").is_valid(), False)
    

if __name__ == '__main__':
    unittest.main()