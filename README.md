# Agricultural Credit Lifecycle Platform

India's agricultural credit infrastructure for intelligent loan management, transforming lending from burden into supportive partnership.

## Product Vision

Become India's agricultural credit lifecycle infrastructure where every loan is continuously nurtured through intelligent automation, transforming lending from burden into supportive partnership.

## Target Audience

- **Smallholder Farmers**: Primary users seeking formal credit for agricultural activities
- **Farmer Producer Organizations (FPOs)**: Coordinating member support and collective credit management
- **Banks & Financial Institutions**: Managing agricultural loan portfolios efficiently

## Core Features

- **Farmer Management**: Complete CRUD operations for farmer profiles including land details, crop types, and organizational affiliations
- **Loan Management**: Full lifecycle management of agricultural loans with status tracking, disbursement, and repayment monitoring
- **Organization Management**: FPO registration and member coordination capabilities

## Technology Stack

- **Backend Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Style**: RESTful APIs
- **Architecture**: Modular Monolith with clear separation of concerns
- **Validation**: Pydantic for request/response validation
- **Server**: Uvicorn ASGI server

## Prerequisites

- Python 3.9 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## Installation

1. **Clone the repository** (if applicable)

2. **Create a virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up PostgreSQL database**:
```bash
# Create database
createdb agri_credit_db

# Or using psql
psql -U postgres
CREATE DATABASE agri_credit_db;
```

5. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your database credentials and secret key
```

## Configuration

Edit the `.env` file with your settings:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/agri_credit_db
SECRET_KEY=your-strong-secret-key-here
DEBUG=False
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

## Running the Application

### Development Mode

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### Production Mode

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
- `GET /` - Root health check
- `GET /health` - Detailed health status

### Farmers
- `POST /api/v1/farmers` - Create a new farmer
- `GET /api/v1/farmers` - List all farmers (with pagination)
- `GET /api/v1/farmers/{farmer_id}` - Get farmer details
- `PUT /api/v1/farmers/{farmer_id}` - Update farmer information
- `DELETE /api/v1/farmers/{farmer_id}` - Delete a farmer

### Loans
- `POST /api/v1/loans` - Create a new loan
- `GET /api/v1/loans` - List all loans (with pagination)
- `GET /api/v1/loans/{loan_id}` - Get loan details
- `PUT /api/v1/loans/{loan_id}` - Update loan information
- `DELETE /api/v1/loans/{loan_id}` - Delete a loan

### Organizations
- `POST /api/v1/organizations` - Create a new FPO
- `GET /api/v1/organizations` - List all organizations (with pagination)
- `GET /api/v1/organizations/{organization_id}` - Get organization details
- `PUT /api/v1/organizations/{organization_id}` - Update organization information
- `DELETE /api/v1/organizations/{organization_id}` - Delete an organization

## Project Structure

```
.
├── backend/
│   ├── __init__.py
│   ├── main.py              # Application entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection and session
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── requirements.txt     # Python dependencies
│   └── routers/
│       ├── __init__.py
│       ├── farmers.py       # Farmer endpoints
│       ├── loans.py         # Loan endpoints
│       └── organizations.py # Organization endpoints
├── .env.example             # Environment variables template
└── README.md               # This file
```

## Database Models

### Farmer
- Personal information (name, phone, email, address)
- Agricultural details (land size, crop type)
- Organization affiliation
- Timestamps

### Loan
- Loan details (amount, interest rate, duration)
- Status tracking (pending, approved, active, completed, defaulted, rejected)
- Disbursement and repayment dates
- Outstanding amount tracking
- Farmer relationship

### Organization
- FPO details (name, registration number)
- Contact information
- Member count
- Farmer relationships

## Security Features

- Environment-based configuration
- Input validation using Pydantic
- SQL injection prevention via SQLAlchemy ORM
- CORS configuration
- Secure password handling ready (for future authentication)
- Proper error handling and logging

## Development Guidelines

- Follow PEP 8 style guide for Python code
- Use type hints for better code clarity
- Add logging for important operations
- Validate all inputs using Pydantic schemas
- Handle errors gracefully with appropriate HTTP status codes
- Keep business logic separate from route handlers

## Success Metrics

- Efficient loan application processing
- Reduced default rates through better tracking
- Improved farmer satisfaction with credit access
- Streamlined FPO coordination
- Enhanced portfolio management for banks

## Future Enhancements

- Authentication and authorization system
- Payment gateway integration
- SMS/Email notifications
- Analytics dashboard
- Mobile application
- Document management system
- Credit scoring system

## Support

For issues and questions, please refer to the API documentation at `/docs` endpoint.

## License

[Add your license information here]
