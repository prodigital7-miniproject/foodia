export function Footer() {
    return (
      <footer className="bg-gray-50 border-t border-gray-100 pb-14">
        <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-4">
         
          <div className="border-t border-gray-200" />
          <div className="space-y-1 text-xs text-gray-400 leading-relaxed">
            <p className="font-semibold text-gray-600">Foodia</p>
            <p>서울특별시 성동구 성수일로8길 59 평화빌딩 B동 2층</p>
            <p>고객센터: 010-6661-1534 (평일 09:00 – 18:00)</p>
            <p className="pt-1">
              Copyright © {new Date().getFullYear()} 푸디아 All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }