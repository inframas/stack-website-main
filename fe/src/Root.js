// Root.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';  // Import the Header component
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

const Root = () => {
  return (
    <div>
      <Header />  {/* Use the Header component */}

      <main className="container mt-4">
        {/* Bootstrap Card */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Welcome to the Application</h5>
            <p className="card-text">
              This is a Bootstrap card added below the header. You can use this section to provide additional information or a welcome message.
            </p>
          </div>
        </div>

        <Outlet />  {/* This will render nested routes */}
      </main>
    </div>
  );
};

export default Root;
