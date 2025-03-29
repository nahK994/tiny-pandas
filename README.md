# Tiny Pandas

Tiny-Pandas is a food delivery platform inspired by Foodpanda, designed with a microservices architecture. It allows users to browse restaurants, place orders, and receive deliveries via riders. Vendors manage their food listings, and admins oversee the system.

## Tech Stack
- 🔙 **Backend:** Golang, Python
- 🗄️ **Database:** PostgreSQL
- 🔗 **Communication:** gRPC, Kafka
- 🔐 **Authentication:** RBAC (Role-Based Access Control)
- 🏗️ **Orchestration:** Minikube (for local development)
- 🎨 **Frontend:** Next.js

## **Microservices**  

1. 👤 **Auth Service**  
   - Manages user registration, authentication, and profiles.  
   - Users can browse restaurants, place orders, and track deliveries.  

2. 🍽️ **Vendor Service**  
   - Manages restaurant details, food items, and order processing.  
   - Handles order confirmation and OTP verification.  

3. 🛵 **Rider Service**  
   - Manages rider registration, authentication, and deliveries.  
   - Handles OTP verification for pickups and deliveries.  

4. 📦 **Order Service**  
   - Manages order lifecycle from placement to completion.  
   - Coordinates between users, vendors, and riders.  

5. 💰 **Payment Service**  
   - Handles payments from users to vendors.  
   - Manages rider payments and vendor invoices.  

6. 🏛️ **Admin Service**  
   - Onboards and verifies vendors and riders.  
   - Suspends, bans, or reinstates vendors and riders.  
   - Sends monthly invoices to vendors.

7. 📊 **Analytics Service**  
   - Generated different analytics for admins.

8. 🔍 **Recommendation Service**  
   - Suggests personalized food recommendations for users based on order history and preferences.  
   - Uses machine learning models or rule-based suggestions.   

9. 🔔 **Notification Service**  
   - Determines how users receive notifications (email, SMS, push notifications).  

10. 📧 **Email Service**  
   - Handles all email notifications for users and vendors.
   - Integrates with third-party email services (e.g., SendGrid, SES).  

11. 🔄 **Orchestrator Service**
   - Coordinates workflows between multiple services.
   - Ensures efficient order processing and event handling.

## Database Schema

### 👥 User Table
| Column      | Type         | Constraints          |
|------------|-------------|----------------------|
| id         | UUID        | PRIMARY KEY         |
| name       | TEXT        | NOT NULL            |
| phone      | TEXT        | NOT NULL            |
| email      | TEXT        | UNIQUE, NOT NULL    |
| password   | TEXT        | NOT NULL            |
| role       | TEXT        | ENUM (user, admin, rider, vendor)  |

### 🏪 Vendor Table
| Column      | Type    | Constraints                             |
|-------------|---------|-----------------------------------------|
| id          | UUID    | PRIMARY KEY                             |
| user_id    | UUID   | FOREIGN KEY → users(id)           |
| location_id | UUID    | FOREIGN KEY -> locations(id)            |
| status       | TEXT        | ENUM (pending, under_review, activated, declined, suspended) |
| active_by | UUID   | FOREIGN KEY -> admins(id)     |

### 📋 Vendor Feedback Table
| Column     | Type    | Constraints                        |
|------------|--------|------------------------------------|
| id         | UUID   | PRIMARY KEY                        |
| vendor_id  | UUID   | FOREIGN KEY → vendors(id)         |
| feedback   | TEXT   | NOT NULL                           |
| reply      | TEXT   | NULLABLE                           |
| created_by | UUID   | FOREIGN KEY -> admins(id)     |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP      |

### 🍽️ Food Table (Vendor-specific foods mapped to categories)
| Column       | Type    | Constraints                   |
|-------------|--------|---------------------------------|
| id          | UUID   | PRIMARY KEY                     |
| name        | TEXT   | NOT NULL                        |
| image_url   | TEXT   | NULLABLE                        |
| description | TEXT   | NULLABLE                        |
| category_id | UUID   | FOREIGN KEY -> food_categories(id) |
| status       | TEXT        | ENUM (declined, activated) |
| activated_by | UUID   | FOREIGN KEY -> admins(id)     |

### 🥗 Food Category Table
| Column      | Type         | Constraints          |
|------------|-------------|----------------------|
| id         | UUID        | PRIMARY KEY         |
| name       | TEXT        | UNIQUE, NOT NULL    |
| description | TEXT       | NULLABLE            |

### 🏪 Food_Price Table (Links Vendors with Food Items & Custom Pricing)
| Column        | Type    | Constraints                   |
|--------------|--------|---------------------------------|
| id           | UUID   | PRIMARY KEY                     |
| food_id      | UUID   | FOREIGN KEY -> food_items(id)   |
| price        | DECIMAL | NOT NULL                       |
| discount     | DECIMAL | DEFAULT 0                      |
| status       | TEXT        | ENUM (activated, not_activated) |
| created_at   | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP           | When the preference was created |
| updated_at   | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP ON UPDATE | When the preference was last updated |

### 🍽️ Food Feedback Table
| Column     | Type    | Constraints                        |
|------------|--------|------------------------------------|
| id         | UUID   | PRIMARY KEY                        |
| food_id    | UUID   | FOREIGN KEY → foods(id)           |
| feedback   | TEXT   | NOT NULL                           |
| reply      | TEXT   | NULLABLE                           |
| status     | ENUM   | ('pending', 'addressed', 'closed') |
| created_by | UUID   | FOREIGN KEY -> admins(id)     |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP      |

### Order Table
| Column       | Type         | Constraints               |
|-------------|-------------|---------------------------|
| id          | UUID        | PRIMARY KEY              |
| user_id     | UUID        | FOREIGN KEY -> users(id) |
| vendor_id   | UUID        | FOREIGN KEY -> vendors(id) |
| rider_id    | UUID        | FOREIGN KEY -> riders(id) |
| status      | TEXT        | ENUM (confirmed, picked_up, completed, cancelled) |
| otp         | TEXT        | NOT NULL                 |

### 📦 Order_Food_Item Table (Links Ordered Food Items with Orders)
| Column      | Type    | Constraints                   |
|------------|--------|---------------------------------|
| id         | UUID   | PRIMARY KEY                     |
| order_id   | UUID   | FOREIGN KEY -> orders(id)       |
| food_id    | UUID   | FOREIGN KEY -> vendor_food(id)  |
| quantity   | INT    | NOT NULL                        |
| price      | DECIMAL | NOT NULL                       |
| discount   | DECIMAL | DEFAULT 0                      |

### 💳 Payment Table
| Column        | Type         | Constraints                          |
|--------------|-------------|--------------------------------------|
| id           | UUID        | PRIMARY KEY                         |
| order_id     | UUID        | FOREIGN KEY -> orders(id)           |
| amount       | DECIMAL     | NOT NULL                            |
| status       | TEXT        | ENUM (pending, completed, refunded) |
| payment_type | TEXT        | ENUM (e-wallet, COD, online)        |
| transaction_id | TEXT       | UNIQUE, NULLABLE                    |

### 📢 Notification Preferences Table
| Column        | Type        | Constraints                         | Description |
|--------------|------------|-------------------------------------|-------------|
| id           | UUID       | PRIMARY KEY                         | Unique identifier for the preference entry |
| user_id      | UUID       | FOREIGN KEY -> users(id)           | Links preference to a specific user |
| order_updates | BOOLEAN    | DEFAULT TRUE                        | Whether the user wants order-related notifications |
| promotions   | BOOLEAN    | DEFAULT TRUE                        | Whether the user wants promotional messages |
| otp_notifications | BOOLEAN | DEFAULT TRUE                        | Whether the user wants OTP-related notifications |
| preferred_channel | TEXT   | ENUM (email, sms, push)            | User's preferred notification channel |
| created_at   | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP           | When the preference was created |
| updated_at   | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP ON UPDATE | When the preference was last updated |

### 📍 Bangladesh Location Table
| Column      | Type        | Constraints                      |
|------------|------------|----------------------------------|
| id         | UUID       | PRIMARY KEY                     |
| division   | TEXT       | NOT NULL                        |
| district   | TEXT       | NOT NULL                        |
| status     | TEXT       | ENUM (active, inactive)         |

### 🚴 Rider Table
| Column      | Type         | Constraints          |
|------------|-------------|----------------------|
| id         | UUID        | PRIMARY KEY         |
| user_id    | UUID   | FOREIGN KEY → users(id)           |
| profile_pic_url       | TEXT        | NOT NULL            |
| status       | TEXT        | ENUM (pending, under_review, activated, suspended) |

## 🚫💸 Rider Penalty Table

| Column Name       | Data Type        | Constraints          | Description                           |
|-------------------|-----------------|----------------------|--------------------------------------|
| id              | INT              | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each penalty record |
| rider_id        | INT              | FOREIGN KEY (riders.id) | Rider associated with the penalty    |
| order_id        | INT              | FOREIGN KEY (orders.id) | Order for which the penalty was issued |
| penalty_amount  | DECIMAL(10,2)    | NOT NULL             | Amount of the penalty                |
| penalty_reason  | VARCHAR(255)     | NOT NULL             | Reason for the penalty (e.g., "Failed delivery", "Late pickup") |
| penalty_status  | ENUM('Unpaid', 'Paid', 'Disputed') | DEFAULT 'Unpaid' | Current status of the penalty       |
| issued_at       | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP | Date and time when penalty was issued |
| due_date        | DATE             | NOT NULL             | Deadline for penalty payment         |
| paid_at         | TIMESTAMP        | NULLABLE             | Date and time when the penalty was paid |
| dispute_reason  | VARCHAR(255)     | NULLABLE             | Reason provided if the penalty is disputed |
| resolved_at     | TIMESTAMP        | NULLABLE             | Date and time when a dispute was resolved |

### Indexes
- `rider_id` for quicker lookups of penalties by rider
- `order_id` to trace penalties to specific orders
- `penalty_status` for easy filtering by payment or dispute status



## Operational Workflow
The detailed work flow for registration, order processing, OTP verification, payments, and admin functionalities is documented in [operational_workflow.md](operational_workflow.md).
