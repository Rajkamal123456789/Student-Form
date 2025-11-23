import pymysql
import json
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='studentdata'
)

def response(statusCode=200, message="Success", result={}, success=True, error=""):
    return {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body": json.dumps({
            "success": success,
            "message": message,
            "result": result,
            "status": statusCode
        })
    }

@app.route("/StudentData",methods=["POST"])
def demoData():
    data = request.get_json()
    action = data.get("action")
    if action == "insert":
        return insert_student(data)
    elif action == "retrive":
        return retrive_student(data)
    else:
        print("Error!!!")

def insert_student(data):
    registerNumber = data.get("regNumber")
    name = data.get("name")
    department = data.get("department")
    year = data.get("year")
    section = data.get("section")
    activity = data.get("activity")

    try:
        conn.begin()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("""
            INSERT INTO student(
                       register_number,
                       name,
                       department,
                       year,
                       section,
                       activity) VALUES (%s,%s,%s,%s,%s,%s)
                        """,
                        (
                            registerNumber,
                            name,
                            department,
                            year,
                            section,
                            activity
                        )
                        )
        conn.commit()
        return response(message="Student Data Insert Successfully!")
    except pymysql.IntegrityError as e:
        conn.rollback()
        if e.args[0] == 1062:
            statusCode = 409
            message = "ID already exists!"
            return response(message=message,statusCode=statusCode)
        elif e.args[0] == 1452:
            statusCode = 409
            message = "ID Conflict!"
            return response(message=message,statusCode=statusCode)
        else:
            statusCode = 403
            message = "Integrity Error!"
            return response(message=message,statusCode=statusCode)
    except Exception as err:
        return response(
            statusCode=500, message="Internal server error: " + str(err), success=False
        )
    finally:
        cursor.close()
        
def retrive_student(data):
    registerNumber = data.get("regnumber")
    try:
        conn.begin()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("""

                SELECT
                       name,
                       department,
                       year,
                       section,
                       activity
                FROM student
                WHERE
                     register_number = %s
                        """,(registerNumber)
                        )
        data = cursor.fetchone()
        return response(result={"data":data})
    
    except Exception as err:
        return response(
            statusCode=500, message="Internal server error: " + str(err), success=False
        )
    finally:
        cursor.close()

if __name__ == "__main__":
    app.run(debug=True)