# Operational Workflow for Tiny-Pandas

Tiny-Pandas follows a structured workflow to ensure seamless food delivery, secure payments, and proper administration. Below is the detailed business logic for the core functionalities.

## Vendor Onboarding Flow
   - Vendor register to the portal with minimum 1 food item with status **Pending**
   - Admin reviews the registration request.
      - If all ok, then status updates to **Approved**
      - Else admin gives some feedback and status updates to **Under Review**
   - Vendor adapts changes and update the status back to **Pending**
      - After this admin can set the status to **Under Review** with new feedback or status update to **Approved** or **Declined**

## Vendor Food Item onboarding Flow
   - Vendor adds new food items and sends it for review to admin with status **Pending**
   - Admin reviews the food review request.
      - If all ok, then status updates to **Active**
      - Else admin gives some feedback and status updates to **Under Review**

## Vendor Food price update flow
   - If food price updates, it creates a new row in table with the status **Active** and updated the old food price status into **Not Active** 

## Order Processing Flow
1. **User Places an Order** 🛒
   - The user selects a restaurant and food items.
   - The order request is sent to the **Vendor Service**.
   - The **Order Service** assigns an available rider.

2. **Vendor Confirms Order** 🍽️
   - The vendor receives the order request.
   - The vendor accepts/rejects the order.

3. **Rider Confirms Order** 🍽️
   - The **Rider Service** notifies the assigned rider.
   - The rider receives the order request.
   - The rider accepts/rejects the order.
      - If one rider rejects, it try 10 another riders.
         - If no rider accepts, it order status **Cancelled**

4. **Process Order**
   - If both vendor and rider accepts, the order status updates to **Preparing**
   - An **OTP** is generated for the user, vendor, and rider.

5. **Rider Collects the Order** 🚴‍♂️
   - The rider arrives at the vendor’s location and shares the **OTP**.
   - If **OTP** matches, the rider collects the package.
   - The order status updates to **"Picked Up"**.

6. **Delivery to User** 🏠
   - The rider travels to the user’s location.
   - Upon arrival, the rider asks the user for their **OTP**.
   - If **OTP** matches, the package is delivered.
   - The rider collects payment (if cash-on-delivery).
   - The order status updates to **"Completed"**.
   
## Payment Mechanism 💰
1. **Payment Options**
   - Users can pay via:
     - **E-wallet** (integrated into the system)
     - **Cash-on-Delivery** (collected by rider and transferred to vendor)

2. **Admin’s Role in Payments** 🏦
   - Admin collects **monthly commissions** from vendors.
   - Admin pays **riders' earnings** based on completed deliveries.

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
