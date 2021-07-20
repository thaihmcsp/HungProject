import React, { useState } from "react";
import "./bill.scss";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import { themDauChamVaoGiaTien } from "../../../../shareFunction/numberToString";
import { hideLoading, showLoading } from "../../../../actions/loading";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "../../../../shareFunction/checkCookies";
import axios from "axios";
import { postBillToReducer } from "../../../../actions/billUser";
import { dispatchHistory } from "../../../../actions/history";

BillOFUser.propTypes = {
  bills: PropTypes.array,
};
BillOFUser.defaultProps = {
  bills: null,
};

function BillOFUser(props) {
  const { bills } = useSelector((state) => state.bills);
  const [donHang, setDonHang] = useState(bills[0]);
  let totalMoney;
  if (donHang !== undefined) {
    totalMoney = themDauChamVaoGiaTien(donHang.TongTien);
  }
  const [index, setIndex] = useState("");
  const dispatch = useDispatch();

  function handleClickToSelectViewDetailBill(bill, index) {
    setDonHang(bill);
    setIndex(index);
    let element = document.querySelector(".modal-open-view-bill");
    element.style.display = "block";
  }

  function handleClickToCloseReviewBill() {
    let element = document.querySelector(".modal-open-view-bill");
    element.style.display = "none";
  }
  function handleClickToOpenConfirm() {
    let element = document.querySelector(".modal-open-confirm-bill");
    element.style.display = "block";
  }

  function handleClickToConfirm() {
    let element = document.querySelector(".modal-open-confirm-bill");
    element.style.display = "none";
    let viewBill = document.querySelector(".modal-open-view-bill");
    viewBill.style.display = "none";
    showLoading(true);
    postBillForUserModol();
  }
  const postBillForUserModol = async () => {
    let cloneBill = [...bills];
    let history = cloneBill.splice(index, 1);
    try {
      const cookies = getCookie("user");
      let responseBill = await axios({
        method: "PUT",
        url: "http://localhost:9527/user/addbill",
        headers: { Authorization: cookies },
        data: {
          bill: { cloneBill },
        },
      });
      let responseHistory = await axios({
        method: "PUT",
        url: "http://localhost:9527/user/addhistory",
        headers: { Authorization: cookies },
        data: {
          history: { history },
        },
      });
      if (responseHistory.data.status === 200) {
        let history = dispatchHistory(responseHistory.data.user.history);
        dispatch(history);
      }
      if (responseBill.data.status === 200) {
        let bill = postBillToReducer(responseBill.data.user.bill);
        dispatch(bill);
        dispatch(hideLoading(false));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function handleClickToCancelConfirm() {
    let element = document.querySelector(".modal-open-confirm-bill");
    element.style.display = "none";
  }
  return (
    <div className="div-parent-bill-user">
      <div className="dashboard-right-top">
        <h3 className="dashboard-right-top-title">Đơn mua của tôi</h3>
        <span className="dashboard-right-top-content">
          Theo dõi đơn hàng của bạn để sớm nhận sản phẩm
        </span>
      </div>
      <Col
        className="div-children-change-info-user"
        xxl={24}
        xl={24}
        lg={24}
        md={24}
        sm={24}
      >
        <ul className="ul-address-dashboard">
          {bills.map((billUser, index) => {
            let tongtien = "";
            if (bills !== undefined) {
              tongtien = themDauChamVaoGiaTien(billUser.TongTien);
            }
            return (
              <li key={billUser.id}>
                <table className="table-left-dashboard">
                  <tr className="tr-dashboard-info">
                    <td className="td-address-left">Tên người nhận:</td>
                    <td className="td-address-right">{billUser.HoVaTen}</td>
                    <td className="td-address-left">Điện thoại:</td>
                    <td className="td-address-right">{billUser.SoDienThoai}</td>
                  </tr>
                  <tr className="tr-dashboard-info">
                    <td className="td-address-left">Ngày đặt:</td>
                    <td className="td-address-right">{billUser.NgayDat}</td>
                    <td className="td-address-left">Số lượng:</td>
                    <td className="td-address-right">
                      {billUser.products.listItems.length}
                    </td>
                    <td className="td-address-left">Tổng tiền:</td>
                    <td className="td-address-right">{tongtien}đ</td>
                  </tr>
                  <tr className="tr-dashboard-info">
                    <td className="td-address-left"></td>
                    <td className="td-address-right"></td>
                    <td className="td-address-left"></td>
                    <td className="td-address-right"></td>
                    <td className="td-address-right">
                      <button
                        className="btn-click-to-open-detail-bill"
                        onClick={() =>
                          handleClickToSelectViewDetailBill(billUser, index)
                        }
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                </table>
                <hr />
              </li>
            );
          })}
        </ul>
      </Col>
      {donHang !== undefined ? (
        <div className="modal-open-view-bill">
          <div className="modal-open-view-bill_overlay">
            <div class="grid">
              <div className="payPage-content">
                <Row>
                  <Col
                    xxl={{ span: 8, offset: 8 }}
                    xl={{ span: 8, offset: 8 }}
                    lg={{ span: 8, offset: 8 }}
                    md={{ span: 8, offset: 8 }}
                    sm={{ span: 8, offset: 8 }}
                    xs={{ span: 8, offset: 8 }}
                    className="payPage-content_title"
                  >
                    <h3 className="payPage-content_title-bill">
                      ĐƠN HÀNG NGÀY {donHang.NgayDat}{" "}
                    </h3>
                  </Col>
                  <Col
                    xxl={{ span: 2, offset: 6 }}
                    xl={{ span: 2, offset: 6 }}
                    lg={{ span: 2, offset: 6 }}
                    md={{ span: 2, offset: 6 }}
                    sm={{ span: 2, offset: 6 }}
                    xs={{ span: 2, offset: 6 }}
                    className="payPage-content_title"
                  >
                    <FontAwesomeIcon
                      className="payPage-content_title-icon"
                      icon={faTimes}
                      onClick={handleClickToCloseReviewBill}
                    />
                  </Col>
                </Row>
                <hr className="hr-payPage" />
                <div className="payPage-content_body">
                  <Row gutter={[32, 8]}>
                    <Col
                      xxl={{ span: 12, offset: 0 }}
                      xl={{ span: 12, offset: 0 }}
                      lg={{ span: 12, offset: 0 }}
                      md={{ span: 12, offset: 0 }}
                      sm={{ span: 20, offset: 2 }}
                      xs={{ span: 24, offset: 0 }}
                    >
                      <div className="content-body_top">
                        <div className="content-body_top-title">
                          <span>Thông Tin Khách Hàng</span>
                        </div>
                        <hr className="hr-payPage" />
                        <div className="form-user-profile">
                          <form id="form" action="">
                            <Col
                              xxl={24}
                              xl={24}
                              lg={24}
                              md={24}
                              className="no-padding"
                            >
                              <div class="form-control">
                                <input
                                  name="Họ và tên"
                                  type="text"
                                  disabled
                                  placeholder="Họ và Tên"
                                  className="userName"
                                  value={donHang.HoVaTen}
                                />
                                <small>Error message</small>
                              </div>
                            </Col>
                            <div className="email-phoneNumber">
                              <Col
                                xxl={8}
                                xl={8}
                                lg={8}
                                md={8}
                                sm={8}
                                xs={8}
                                className="no-padding"
                              >
                                <div class="form-control">
                                  <input
                                    name="số điện thoại"
                                    type="text"
                                    disabled
                                    placeholder="Số điện thoại"
                                    className="phoneNumber"
                                    value={donHang.SoDienThoai}
                                  />
                                  <small>Error message</small>
                                </div>
                              </Col>
                              <Col
                                xxl={8}
                                xl={8}
                                lg={8}
                                md={8}
                                sm={8}
                                xs={8}
                                className="remove-padding-left no-padding"
                              >
                                <div class="form-control">
                                  <input
                                    name="địa chỉ"
                                    type="text"
                                    disabled
                                    placeholder="Địa Chỉ"
                                    className="phoneNumber"
                                    value={donHang.DiaDiem}
                                  />
                                  <small>Error message</small>
                                </div>
                              </Col>
                              <Col
                                xxl={8}
                                xl={8}
                                lg={8}
                                md={8}
                                sm={8}
                                xs={8}
                                className="remove-padding-left no-padding"
                              >
                                <div class="form-control">
                                  <input
                                    name="thời gian"
                                    type="text"
                                    disabled
                                    placeholder="Thời Gian"
                                    className="phoneNumber"
                                    value={donHang.ThoiGian}
                                  />
                                  <small>Error message</small>
                                </div>
                              </Col>
                            </div>
                            <div>
                              <Col className="no-padding">
                                <div class="form-control">
                                  <textarea
                                    name="Địa chỉ"
                                    type="text"
                                    disabled
                                    placeholder="Địa chỉ nhận hàng"
                                    className="address"
                                    value={donHang.DiaChi}
                                  ></textarea>
                                  <small>Error message</small>
                                </div>
                              </Col>
                            </div>
                          </form>
                          <div className="note-for-user">
                            <span className="note-for-user_title">
                              ** Thanh Toán Khi Nhận Hàng
                            </span>
                            <ul className="note-for-user_ul">
                              <li className="note-for-user_content">
                                * Kiểm tra đơn hàng trước khi thanh toán
                              </li>
                              <li className="note-for-user_content">
                                * Sản phẩm được bảo hành trọn đời theo chính
                                sách The TUXEDO
                              </li>
                              <li className="note-for-user_content">
                                * Mọi thắc mắc xin vui lòng liên hệ Hotline:
                                0965882467
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xxl={{ span: 12, offset: 0 }}
                      xl={{ span: 12, offset: 0 }}
                      lg={{ span: 12, offset: 0 }}
                      md={{ span: 12, offset: 0 }}
                      sm={{ span: 20, offset: 2 }}
                      xs={{ span: 24, offset: 0 }}
                    >
                      <div className="content-body_top-right">
                        <span>Sản Phẩm Đã Chọn</span>
                      </div>
                      <hr className="hr-payPage" />
                      <div>
                        <ul className="list-item-selected-in-payPage">
                          {donHang.products.listItems.map((item) => {
                            // tạo dấu . trong giá tiền
                            let Gia = "";
                            if (item.gia !== undefined) {
                              Gia = themDauChamVaoGiaTien(
                                item.gia * item.soLuong
                              );
                            }

                            // tạo dấu . trong giảm giá tiền
                            let giamGiaString = "";
                            if (item.giamGia !== undefined) {
                              giamGiaString = themDauChamVaoGiaTien(
                                item.giamGia * item.soLuong
                              );
                            }
                            return (
                              <li>
                                <div className="thongtin-sanPham">
                                  <Col
                                    xxl={4}
                                    xl={4}
                                    lg={4}
                                    md={4}
                                    sm={4}
                                    xs={4}
                                    className="remove-padding-right remove-padding-left"
                                  >
                                    <img
                                      className="thongtin-sanPham_tren"
                                      src={item.anhBia}
                                      alt="anhBia"
                                    />
                                  </Col>
                                  <Col
                                    xxl={20}
                                    xl={20}
                                    lg={20}
                                    md={20}
                                    sm={20}
                                    xs={20}
                                    className="remove-padding-right"
                                  >
                                    <div className="thongtin-sanPham_duoi">
                                      <span className="ten-san-pham">
                                        {item.tenSP}
                                      </span>
                                      <div className="size-sl-price">
                                        <span className="size-sl-price_size">
                                          Size: {item.size}
                                        </span>
                                        <span className="size-sl-price_soluong">
                                          Số lượng: {item.soLuong}
                                        </span>
                                        {item.giamGia ? (
                                          <span className="size-sl-price_price">
                                            {giamGiaString}
                                            <span className="price">đ</span>
                                          </span>
                                        ) : (
                                          <span className="size-sl-price_price">
                                            {Gia}
                                            <span className="price">đ</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                </div>
                                <hr className="hr-payPage" />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
                <footer className="footer-cartPage">
                  <div className="footer-cartPage_top">
                    <span className="footer-cartPage_top-title">
                      Tổng Tiền:
                    </span>
                    <span className="footer-cartPage_top-content">
                      {totalMoney}
                      <span className="price">đ</span>
                    </span>
                  </div>
                  <div className="footer-cartPage_bottom">
                    <button className="button-add-item-cart" disabled>
                      <span className="button-add-item-cart_title">
                        HỦY ĐƠN HÀNG
                      </span>
                      <span className="button-add-item-cart_sub">
                        Khiếu nại
                      </span>
                    </button>
                    <button
                      className="button-buy-now"
                      onClick={handleClickToOpenConfirm}
                    >
                      <span className="button-buy-now_title">ĐÃ NHẬN HÀNG</span>
                      <span className="button-buy-now_sub">Thành công</span>
                    </button>
                  </div>
                  <div>
                    <span className="notification-in-payPage">
                      Giỏ hàng trống, vui lòng chọn sản phẩm trước khi Đặt hàng
                    </span>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="modal-open-confirm-bill">
        <div className="modal-open-confirm-bill_overlay">
          <div className="footer-cartPage_bottom">
            <button
              className="button-add-item-cart"
              onClick={handleClickToCancelConfirm}
            >
              <span className="button-add-item-cart_title">Hủy</span>
            </button>
            <button className="button-buy-now" onClick={handleClickToConfirm}>
              <span className="button-buy-now_title">Xác Nhận</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillOFUser;
