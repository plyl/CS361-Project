from flask import Flask, request, jsonify
import psycopg2  # PostgreSQL database connection
from psycopg2.extras import RealDictCursor
from flask_cors import CORS  # Import CORS
from flask import make_response

app = Flask(__name__)
# CORS(app)  # Enable CORS for frontend
CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)




@app.route("/expense/add", methods=["OPTIONS"])
def handle_preflight():
    response = jsonify({"message": "CORS preflight successful"})
    return response, 200

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        dbname=,
        user=,
        password=,
        host="pg-budget-win-budget-win.b.aivencloud.com",
        port="19755"
    )

@app.route("/health", methods=["GET"])
def health_check():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        cursor.close()
        conn.close()
        return jsonify({"status": "healthy"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

@app.route("/expense/add", methods=["POST"])
def expense_add():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["user_id", "Amount", "Merchant", "Category", "Date"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        user_id = data["user_id"]
        amount = data["Amount"]
        merchant = data["Merchant"]
        category = data["Category"]
        date = data["Date"]

        # Insert data into the PostgreSQL database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO budget_win_schema.expense (user_id, amount, merchant, category, date) 
            VALUES (%s, %s, %s, %s, %s) RETURNING expense_id;
            """,
            (user_id, amount, merchant, category, date)
        )
        expense_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"expense_id": expense_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/expense/list", methods=["GET"])
def get_expense_list():
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            """
            SELECT expense_id, amount, merchant, category, date 
            FROM budget_win_schema.expense 
            WHERE user_id = %s
            ORDER BY date DESC;
            """,
            (user_id,)
        )
        expenses = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(expenses), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/expense/delete", methods=["DELETE"])
def delete_expense():
    try:
        data = request.get_json()
        if "expense_id" not in data:
            return jsonify({"error": "Missing expense_id parameter"}), 400

        expense_id = data["expense_id"]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            DELETE FROM budget_win_schema.expense WHERE expense_id = %s;
            """,
            (expense_id,)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return "", 204  # No content response

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/budget/update", methods=["POST"])
def update_budget():
    try:
        data = request.get_json()
        if not data or "user_id" not in data or "budget" not in data:
            return jsonify({"error": "Missing user_id or budget parameter"}), 400

        user_id = data["user_id"]
        budget = data["budget"]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE budget_win_schema.budget 
            SET budget= %s 
            WHERE user_id = %s
            RETURNING budget_id;
            """,
            (budget, user_id)
        )

        budget_id = cursor.fetchone()

        conn.commit()
        cursor.close()
        conn.close()

        if budget_id:
            return jsonify({"budget_id": budget_id[0]}), 201
        else:
            return jsonify({"error": "User ID not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/budget/list", methods=["GET"])
def get_budget_list():
    try:
        user_id = request.args.get("user_id")  # Extract user_id from query params

        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch budget for a specific user_id
        cursor.execute(
            """
            SELECT budget 
            FROM budget_win_schema.budget 
            WHERE user_id = %s;
            """,
            (user_id,)
        )
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result:
            return jsonify({ "budget": result[0]}), 200
        else:
            return jsonify({"error": "User ID not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5002)
