'use client';

import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Payment Empire - Demo
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Payment System Overview
          </h2>
          <p className="text-gray-600 mb-4">
            This demo showcases the complete payment flow implementation. The system includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Dynamic payment page with campaign information</li>
            <li>Customer information collection form</li>
            <li>Bank QR code payment integration</li>
            <li>Real-time payment status checking</li>
            <li>Webhook for payment confirmation</li>
            <li>Automatic user creation and group assignment</li>
            <li>Email confirmation system</li>
          </ul>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Test Payment Link
            </h3>
            <p className="text-gray-600 mb-4">
              Click the button below to view the payment page. Note: This is a demo version that requires backend API integration to function fully.
            </p>
            <Link
              href="/payment/demo-link-12345"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View Payment Page Demo
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Features Implemented
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ Campaign Display
              </h3>
              <p className="text-sm text-gray-600">
                Shows product name, description, image, original price, multiple discounts, and final price
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ Customer Form
              </h3>
              <p className="text-sm text-gray-600">
                Collects full name, phone number, email, and address with validation
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ Payment Method
              </h3>
              <p className="text-sm text-gray-600">
                Displays bank transfer option with support for multiple Vietnamese banks
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ QR Code Generation
              </h3>
              <p className="text-sm text-gray-600">
                Integrates with bank API to generate QR code for payment scanning
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ Payment Status
              </h3>
              <p className="text-sm text-gray-600">
                Real-time polling to check payment status every 5 seconds
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ Webhook Integration
              </h3>
              <p className="text-sm text-gray-600">
                Receives bank notifications and processes post-payment actions
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ User Creation
              </h3>
              <p className="text-sm text-gray-600">
                Automatically creates user account after successful payment
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ Email Confirmation
              </h3>
              <p className="text-sm text-gray-600">
                Sends email with order confirmation and login credentials
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Supported Banks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">MSB</div>
              <div className="text-xs text-gray-600">Maritime Bank</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">VCB</div>
              <div className="text-xs text-gray-600">Vietcombank</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">TCB</div>
              <div className="text-xs text-gray-600">Techcombank</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">ACB</div>
              <div className="text-xs text-gray-600">Asia Commercial</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">VPB</div>
              <div className="text-xs text-gray-600">VPBank</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-1">MB</div>
              <div className="text-xs text-gray-600">Military Bank</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 mb-1">BIDV</div>
              <div className="text-xs text-gray-600">BIDV</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 mb-1">VIB</div>
              <div className="text-xs text-gray-600">VIB</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
