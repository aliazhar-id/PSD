# Prediksi Saham

## Overview

Prediksi Saham is a stock prediction application that leverages machine learning models to predict stock trends. The backend is built using Flask, Pandas, Scikit-Learn, Numpy, pytz, and yfinance to process and predict stock data. The frontend utilizes ReactJS, TailwindCSS, ShadCN components for UI design, and Recharts for visualizing stock data.

This project is part of a Proyek Sains Data (Data Science Project), focusing on providing valuable stock prediction insights using data science and machine learning techniques.

## Features

- Real-time stock data visualization
- Interactive charts with Recharts
- Responsive UI with TailwindCSS
- Modular, reusable components built with ShadCN
- Stock prediction data displayed in an intuitive interface
- User-Friendly Interface

## Tech Stack

### Frontend

- ReactJS - JavaScript library for building user interfaces
- TailwindCSS - Utility-first CSS framework
- ShadCN - A modern component library for building accessible UIs
- Recharts - Charting library for React

### Backend

- Flask - Lightweight Python web framework to handle backend processes.
- Pandas - Data manipulation and analysis library, ideal for handling stock data.
- Scikit-Learn - Machine learning library used to train models for stock prediction.
- Numpy - Library for numerical operations and data handling.
- pytz - Python library to handle timezone conversion (used for timestamp data).
- yfinance - Library to fetch real-time stock data from Yahoo Finance API.

## Getting Started

### Prerequisites

To run this project locally, you need to have the following installed:

- Node.js (for running the frontend)
- Python 3.7+ (for running the backend)
- Pip (for installing Python dependencies)

### Installation

1. Clone the repository

```
git clone https://github.com/aliazhar-id/PSD.git
```

2. Create a virtual environment:

```
python3 -m venv venv
```

3. Activate the virtual environment:

- On Windows:

```
venv\Scripts\activate
```

- On macOS/Linux:

```
source venv/bin/activate
```

4. Install the required Python dependencies:

```
pip install -r requirements.txt
```

5. Navigate to the frontend directory:

```
cd PSD/frontend
```

6. Install the necessary npm packages:

```
npm install
```

### Running the Application

- Backend

```
cd backend
python main.py
```

- Frontend

```
cd frontend
npm run dev
```
