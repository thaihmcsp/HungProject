import React, { useState } from "react";
import "./history.scss";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import { themDauChamVaoGiaTien } from "../../../../shareFunction/numberToString";
import { hideLoading, showLoading } from "../../../../actions/loading";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "../../../../shareFunction/checkCookies";
import axios from "axios";
import { dispatchHistory } from "../../../../actions/history";

HistoryBill.propTypes = {
  stories: PropTypes.array,
};
HistoryBill.defaultProps = {
  stories: {},
};
HistoryBill.propTypes = {};
function HistoryBill() {
  const { stories } = useSelector((state) => state.stories);
  console.log(stories);
  const [donHang, setDonHang] = useState(stories[0]);
  console.log(donHang);
  let totalMoney = "";
  if (donHang !== undefined) {
    totalMoney = themDauChamVaoGiaTien(donHang.TongTien);
  }
  const [index, setIndex] = useState("");

  const dispatch = useDispatch();

  function handleClickToSelectViewDetailBill(bill, index) {
    setDonHang(bill);
    setIndex(index);
    let element = document.querySelector(".modal-open-view-history");
    console.log(element);
    element.classList.add("active");
  }

  function handleClickToCloseReviewBill() {
    let element = document.querySelector(".modal-open-view-history");
    element.classList.remove("active");
  }
  function handleClickToOpenConfirm() {
    let element = document.querySelector(".modal-open-confirm-history");
    element.classList.add("active");
  }

  function handleClickToConfirm() {
    let element = document.querySelector(".modal-open-confirm-history");
    element.classList.remove("active");
    let viewBill = document.querySelector(".modal-open-view-history");
    viewBill.classList.remove("active");
    showLoading(true);
    postBillForUserModol();
  }
  const postBillForUserModol = async () => {
    let history = [...stories];
    history.splice(index, 1);
    try {
      const cookies = getCookie("user");
      let responseHistory = await axios({
        method: "PUT",
        url: "/user/addhistory",
        headers: { Authorization: cookies },
        data: {
          history: { history },
        },
      });
      if (responseHistory.data.status === 200) {
        let history = dispatchHistory(responseHistory.data.user.history);
        dispatch(history);
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
    <div className="div-parent-history-user">
      <div className="dashboard-right-top">
        <h3 className="dashboard-right-top-title">L???ch s??? mua h??ng</h3>
        <span className="dashboard-right-top-content">
          Theo d??i l???ch s??? mua h??ng c???a b???n
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
          {stories.map((billUser, index) => {
            let tongtien = "";
            if (stories !== undefined) {
              tongtien = themDauChamVaoGiaTien(billUser.TongTien);
            }
            return (
              <li key={billUser.id}>
                <table className="table-left-dashboard">
                  <tr className="tr-dashboard-info">
                    <td className="td-address-left">T??n ng?????i nh???n:</td>
                    <td className="td-address-right">{billUser.HoVaTen}</td>
                    <td className="td-address-left">??i???n tho???i:</td>
                    <td className="td-address-right">{billUser.SoDienThoai}</td>
                  </tr>
                  <tr className="tr-dashboard-info">
                    <td className="td-address-left">Ng??y ?????t:</td>
                    <td className="td-address-right">{billUser.NgayDat}</td>
                    <td className="td-address-left">S??? l?????ng:</td>
                    <td className="td-address-right">
                      {billUser.products.listItems.length}
                    </td>
                    <td className="td-address-left">T???ng ti???n:</td>
                    <td className="td-address-right">{tongtien}??</td>
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
                        Xem chi ti???t
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
        <div className="modal-open-view-history">
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
                      ????N H??NG NG??Y {donHang.NgayDat}
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
                          <span>Th??ng Tin Kh??ch H??ng</span>
                        </div>
                        <hr className="hr-payPage" />
                        <div className="form-user-profile">
                          <form id="form2" action="">
                            <Col
                              xxl={24}
                              xl={24}
                              lg={24}
                              md={24}
                              className="no-padding"
                            >
                              <div class="form-control">
                                <input
                                  name="H??? v?? t??n"
                                  type="text"
                                  disabled
                                  placeholder="H??? v?? T??n"
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
                                    name="s??? ??i???n tho???i"
                                    type="text"
                                    disabled
                                    placeholder="S??? ??i???n tho???i"
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
                                    name="?????a ch???"
                                    type="text"
                                    disabled
                                    placeholder="?????a Ch???"
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
                                    name="th???i gian"
                                    type="text"
                                    disabled
                                    placeholder="Th???i Gian"
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
                                    name="?????a ch???"
                                    type="text"
                                    disabled
                                    placeholder="?????a ch??? nh???n h??ng"
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
                              ** Thanh To??n Khi Nh???n H??ng
                            </span>
                            <ul className="note-for-user_ul">
                              <li className="note-for-user_content">
                                * Ki???m tra ????n h??ng tr?????c khi thanh to??n
                              </li>
                              <li className="note-for-user_content">
                                * S???n ph???m ???????c b???o h??nh tr???n ?????i theo ch??nh
                                s??ch The TUXEDO
                              </li>
                              <li className="note-for-user_content">
                                * M???i th???c m???c xin vui l??ng li??n h??? Hotline:
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
                        <span>S???n Ph???m ???? Ch???n</span>
                      </div>
                      <hr className="hr-payPage" />
                      <div>
                        <ul className="list-item-selected-in-payPage">
                          {donHang.products.listItems.map((item) => {
                            // t???o d???u . trong gi?? ti???n
                            let Gia = "";
                            if (item.gia !== undefined) {
                              Gia = themDauChamVaoGiaTien(
                                item.gia * item.soLuong
                              );
                            }

                            // t???o d???u . trong gi???m gi?? ti???n
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
                                          S??? l?????ng: {item.soLuong}
                                        </span>
                                        {item.giamGia ? (
                                          <span className="size-sl-price_price">
                                            {giamGiaString}
                                            <span className="price">??</span>
                                          </span>
                                        ) : (
                                          <span className="size-sl-price_price">
                                            {Gia}
                                            <span className="price">??</span>
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
                      T???ng Ti???n:
                    </span>
                    <span className="footer-cartPage_top-content">
                      {totalMoney}
                      <span className="price">??</span>
                    </span>
                  </div>
                  <div className="footer-cartPage_bottom">
                    <button className="button-add-item-cart">
                      <span className="button-add-item-cart_title">
                        ????ng ????n H??ng
                      </span>
                      <span className="button-add-item-cart_sub">Close</span>
                    </button>
                    <button
                      className="button-buy-now"
                      onClick={handleClickToOpenConfirm}
                    >
                      <span className="button-buy-now_title">X??a ????n H??ng</span>
                      <span className="button-buy-now_sub">Delete</span>
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="modal-open-confirm-history">
        <div className="modal-open-confirm-bill_overlay">
          <div className="footer-cartPage_bottom">
            <button
              className="button-add-item-cart"
              onClick={handleClickToCancelConfirm}
            >
              <span className="button-add-item-cart_title">H???y</span>
            </button>
            <button className="button-buy-now" onClick={handleClickToConfirm}>
              <span className="button-buy-now_title">X??c Nh???n</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryBill;
