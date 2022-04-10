import React from 'react'

export default function Footer() {
  return (
    <div className="footerView">
      <div className="container">
      <div className="row">
        <div className="col-3">
          <h3>VỀ CHÚNG TÔI</h3>
          <div style={{ textAlign: 'left' }}>
            <p>Điều khoản</p>
            <p>Chính sách bảo mật</p>
          </div>
        </div>
        <div className="col-6">
          <h3>ĐỊA CHỈ</h3>
          <div style={{ textAlign: 'left' }}>
            <p>Công ty TNHH Thể dục thể thao Việt Nam</p>
            <p>MST: 0109475876</p>
            <p>Địa chỉ: Tầng 6, Tòa nhà Kim Khí Thăng long, Sô 1 Lương Yên, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội, Việt Nam</p>
            <p>Email: <span style={{ color: 'red' }}>bachtuananh16@gmail.com</span></p>
          </div>
        </div>
        <div className="col-3 icon text-right">
          <button>
            <i class="fab fa-facebook-square"></i>
          </button>
          <button>
            <i class="fab fa-instagram"></i>
          </button>
          <button>
            <i class="fab fa-twitter"></i>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
