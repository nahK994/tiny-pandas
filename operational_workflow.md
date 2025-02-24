# Operational Workflow for Tiny-Pandas

Tiny-Pandas follows a structured workflow to ensure seamless food delivery, secure payments, and proper administration. Below is the detailed business logic for the core functionalities.

## Vendor Onboarding Flow
   - Vendor registers on the portal with their minimum information.
   - Admin reviews the registration request.
      - If all ok, then status updates to **Activated**
      - Else admin gives some feedback and status updates to **Under Review**
   - Vendor makes the required changes and updates the status back to **Pending**
      - After this admin can set the status to **Under Review** with new feedback or status update to **Activated** or **Declined**

## Vendor Food Item onboarding Flow
   - Vendor adds new food items and sends it for review to admin with status **Pending**
   - Admin reviews the food review request.
      - If all ok, then status updates to **Activated**
      - Else food status updates to **Declined**

## Vendor Food price update flow
   - It creates a new row in the table with the status **Activated** and updates the old food price status to **Not Activated**.
   - The old price remains in history but is marked as **Not Activated**.

## Order Processing Flow
   - The user selects a restaurant and food items.
   - The order request is sent to the **Vendor Service**.
   - The **Order Service** assigns an available rider.

   - The **Vendor service** notifies that vendor/restaurant.
   - If vendor rejects the order -
      - Order status updates to **Cancelled**
   - If vendor accepts the order - 
      - The **Rider Service** assigns and sends a shipping request to a rider.
   
   - If the rider rejects the shipping request,
      - It retries assigning a rider up to 10 times..
         - If no rider accepts, the order status updates to **Cancelled**
   
   - If the vendor accepts the order and the rider accepts the shipping request, the order status updates to **Confirmed**
   - An **OTP** is generated for the user, vendor, and rider.

   - The rider arrives at the vendor’s location and collects package by sharing the **OTP** to the vendor.
   - The order status updates to **"Picked Up"**.

   - If rider successfully travels to the user’s location-
      - User receives the package by sharing the **OTP** to the rider.
      - The order status updates to **"Completed"**.
   - If rider fails to reach user's location-
      - Order is **Cancelled**, rider gets penalty with the order's price and user gets refunded.
   
## Payment Mechanism 💰
   - Admin gets payment to their **E-wallet** from user when order is placed(before **Confirmed**).
   - User gets refund if order gets **Cancelled**
   - After order is **Confirmed**, vendor gets it's payment with proper invoice. 
   - Rider gets their payment from admin with proper invoice at the end of the month.

   - Rider will get different invoice for penalty.
   - If rider doesn't pays his/hers penalty within 7 days of the beginning of the month, rider account will be **Suspended**
   - If rider account is **Suspended**, rider will have to contact with Admin manually.

## Admin Controls ⚙️
1. **Vendor & Rider Onboarding**
   - Vendors and riders must be verified before activation.
   - Admin approves/rejects vendor and rider applications.

2. **Vendor & Rider Management**
   - Admin can **ban/suspend** vendors and riders.
   - Vendors and riders receive a warning before suspension.

3. **Managing Food Categories 🍽️**
   - Admin creates and maintains food categories.
   - Vendors can map their food items to these predefined categories.

4. **Business Location Management 📍**
   - Admin manages the list of valid business locations (divisions, districts, upazilas, areas).
   - Locations can be **added, updated, or deactivated** as needed.

5. **Monitoring & Compliance 📊**
   - Admin checks order delays, vendor cancellations, and rider ratings.
   - Monthly reports are sent to vendors for commission payments.

6. **Sets different commission**
   - Admin sets the commission for vendors and riders.
   - Vendor and rider gets after setting up new commission.
