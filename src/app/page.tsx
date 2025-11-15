import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Payment Empire
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Hệ thống quản lý thanh toán hiện đại
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Giải pháp thanh toán toàn diện với tích hợp QR banking, quản lý đơn hàng tự động và trải nghiệm người dùng tối ưu
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Payment</h3>
            <p className="text-gray-600">
              Thanh toán nhanh chóng qua mã QR với hỗ trợ đa ngân hàng
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tự động hóa</h3>
            <p className="text-gray-600">
              Xác nhận thanh toán và tạo tài khoản người dùng tự động
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Thời gian thực</h3>
            <p className="text-gray-600">
              Kiểm tra trạng thái thanh toán và cập nhật ngay lập tức
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trải nghiệm hệ thống ngay
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Khám phá quy trình thanh toán hoàn chỉnh với giao diện thân thiện và dễ sử dụng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo-payment"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Xem Demo Thanh Toán
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>

        {/* Supported Banks Section */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide font-semibold">
            Hỗ trợ đa ngân hàng
          </p>
          <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
            {['MSB', 'VCB', 'TCB', 'ACB', 'VPB', 'MB', 'BIDV', 'VIB'].map((bank) => (
              <div key={bank} className="text-2xl font-bold text-gray-400">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
