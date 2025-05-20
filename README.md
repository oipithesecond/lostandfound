# **FoundIt!**

A dynamic web application built with the **"MEEN"** stack:  
- **Node.js** for server-side programming  
- **EJS** for server-side rendering  
- **MongoDB** for database management  
- **Express.js** as the backend framework  

---

## **Features**

- **User Authentication**: Secure institution-restricted sign-ins using Google OAuth 2.0.  
- **Image Management**: Upload, compress, and store images efficiently.  
- **Session Handling**: Robust user session management with MongoDB integration.  
- **Rate Limiting**: Protection against repeated requests to sensitive endpoints.  

---

## **Node Dependencies**

### **Backend Tools**  
| Dependency         | Purpose                                                                                          |
|--------------------|--------------------------------------------------------------------------------------------------|
| **dotenv**         | Manage environment variables securely.                                                           |
| **passport**       | Authentication middleware for Node.js.                                                          |
| **passport-oauth2** | Generic OAuth 2.0 authentication strategy for Passport.                                         |
| **passport-google-oauth2** | Authenticate with Google using OAuth 2.0.                                               |
| **express-session** | Manage user sessions with unique session IDs.                                                  |
| **connect-mongo**   | Store session data in MongoDB for use with express-session.                                     |
| **express-rate-limit** | Mitigate brute-force attacks by limiting repeated requests to sensitive endpoints.           |

### **Image Processing**  
| Dependency         | Purpose                                                                                          |
|--------------------|--------------------------------------------------------------------------------------------------|
| **multer**         | Handle multipart/form-data, crucial for uploading images.                                        |
| **sharp**          | Perform back-end image compression for optimization.                                             |
| **compress.js**    | Optimize image sizes on the front-end before uploading.                                          |

---



