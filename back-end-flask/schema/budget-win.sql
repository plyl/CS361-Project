-- Create Schema
CREATE SCHEMA IF NOT EXISTS budget_win_schema;

-- Create User Table
CREATE TABLE budget_win_schema.user (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL
);

-- Create Expense Table
CREATE TABLE budget_win_schema.expense (
    expense_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES budget_win_schema.user(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    merchant VARCHAR(255),
    category VARCHAR(255)
);

-- Create Income Table
CREATE TABLE budget_win_schema.income (
    income_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES budget_win_schema.user(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    source VARCHAR(255) NOT NULL
);

-- Create Budget Table
CREATE TABLE budget_win_schema.budget (
    budget_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES budget_win_schema.user(user_id) ON DELETE CASCADE,
    budget DECIMAL(10,2) NOT NULL
);
