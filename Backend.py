from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

import mysql.connector

app = Flask(__name__)
CORS(app, origins=["*"], methods=['GET', 'POST'])
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    return response

# Database Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'rahim123456',
    'database': 'tasks'
}

# Function to connect to MySQL database
def connect_to_database():
    try:
        connection = mysql.connector.connect(**db_config)
        print("Connected to MySQL database")
        return connection
    except mysql.connector.Error as err:
        print("Error:", err)
def create_projects_table():
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                context VARCHAR(255) NOT NULL,
                color VARCHAR(255) NOT NULL,
                number_of_tasks INT NOT NULL DEFAULT 0
            )
        """)
        connection.commit()
        cursor.close()
        connection.close()
# Create task_types table if it doesn't exist
def create_task_types_table():
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor()
        cursor.execute("""
           CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    task VARCHAR(255) NOT NULL,
    color VARCHAR(10) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    dueDateTime DATETIME DEFAULT NULL,
    duration VARCHAR(255) DEFAULT NULL
);
        """)
        connection.commit()
        cursor.close()
        connection.close()

# Route to add task type
@app.route('/add_task', methods=['POST'])
def add_task():
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor()
        new_task_data = request.json
        # Convert the datetime string to a Python datetime object
        dueDateTime_str = new_task_data.get('dueDateTime')
        dueDateTime = datetime.strptime(dueDateTime_str, '%Y-%m-%dT%H:%M:%S.%fZ')

        # Format the datetime object into the desired format
        formatted_dueDateTime = dueDateTime.strftime('%Y-%m-%d %H:%M:%S')

        cursor.execute("""
            INSERT INTO tasks (projectId, task, color, done, dueDateTime, duration)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            new_task_data.get('projectId'),
            new_task_data.get('task'),
            new_task_data.get('color'),
            new_task_data.get('done'),
            formatted_dueDateTime,  # Use the formatted datetime value
            new_task_data.get('duration')
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Task added successfully", "task": new_task_data}), 201
    else:
        return jsonify({"error": "Failed to connect to database"}), 500
# Route to get tasks
@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    connection = connect_to_database()
    if connection:
        projectId = request.args.get('projectId')
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tasks WHERE projectId = %s", (projectId,))
        tasks = cursor.fetchall()
        print(tasks)
        cursor.close()
        connection.close()
        return jsonify({"tasks": tasks}), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500
@app.route('/get_projects', methods=['GET'])
def get_projects():
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT projects.*, COUNT(tasks.id) AS taskCount 
            FROM projects 
            LEFT JOIN tasks ON projects.id = tasks.projectId 
            GROUP BY projects.id
        """)
        projects = cursor.fetchall()
        cursor.close()
        connection.close()

        formatted_projects = []
        for project in projects:
            # Convert taskCount from long to int for JSON serialization
            project['taskCount'] = int(project['taskCount'])
            formatted_projects.append(project)
            print(formatted_projects)
        return jsonify({"projects": formatted_projects})
    else:
        return jsonify({"error": "Failed to connect to database"}), 500
    
@app.route('/add_project', methods=['POST'])
def add_project():
    new_project_data = request.json
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO projects (context, color, number_of_tasks)
            VALUES (%s, %s, %s)
        """, (
            new_project_data['context'],
            new_project_data['color'],
            new_project_data['numberOfTasks']
        ))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Project added successfully", "project": new_project_data}), 201


if __name__ == '__main__':
    create_task_types_table()
    create_projects_table()
    app.run(debug=True)
