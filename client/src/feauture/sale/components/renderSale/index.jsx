import React from "react";
import PropTypes from "prop-types";
import "./renderSale.scss";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";
import PaginationHanmade from "../pagination";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToDetail } from "../../../../actions/itemDetail";
import { themDauChamVaoGiaTien } from "../../../../shareFunction/numberToString";

RenderSale.propTypes = {
  items: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange1: PropTypes.func,
  onPageChange2: PropTypes.func,
  onSelectFilter: PropTypes.func,
  onSelectSort: PropTypes.func,
  totalItem: PropTypes.number,
};

RenderSale.defaultProps = {
  items: [],
  pagination: {},
  onPageChange1: null,
  onPageChange2: null,
  onSelectFilter: null,
  onSelectSort: null,
  totalItem: null,
};

function RenderSale(props) {
  const dispatch = useDispatch();
  const {
    items,
    pagination,
    onSelectFilter,
    onSelectSort,
    onPageChange1,
    onPageChange2,
    totalItem,
  } = props;

  const [idActive, setIdActive] = useState("");
  function handlePageChange1(Page) {
    if (onPageChange1) {
      onPageChange1(Page.number);
    }
    setIdActive(Page.id);
  }

  function handlePageChange2(newPage) {
    if (onPageChange2) {
      onPageChange2(newPage);
    }
  }

  function handleSelectFilter(e) {
    let value = e.target.value;
    if (onSelectFilter) {
      onSelectFilter(value);
    }
  }

  function handleSelectSort(e) {
    let value = e.target.value;
    if (onSelectSort) {
      onSelectSort(value);
    }
  }

  function handleClickSendItem(item) {
    const action = addItemToDetail(item);
    dispatch(action);
  }
  return (
    <body className="Body">
      <div className="grid">
        <div className="body-top">
          <Col
            xxl={{ span: 8 }}
            xl={{ span: 8 }}
            lg={{ span: 8 }}
            md={{ span: 10 }}
            sm={{ span: 12 }}
          >
            <form className="body-top_form-left" action="">
              <label className="label-top_left" htmlFor="">
                B??? L???c:
              </label>
              <select
                className="select-option_left"
                autofocus="autofocus"
                name="boloc"
                id=""
                onChange={handleSelectFilter}
              >
                <option defaultValue value="1">
                  T???t C???
                </option>
                <option value="0-500000">Nh??? h??n 500.000??</option>
                <option value="500000-1000000">T??? 500.000?? - 1.000.000??</option>
                <option value="1000000-2000000">
                  T??? 1.000.000?? - 2.000.000??
                </option>
                <option value="2000000-2500000">
                  T??? 2.000.000?? - 2.500.000??
                </option>
                <option value="2500000-4000000">
                  T??? 2.500.000?? - 4.000.000??
                </option>
                <option value="4000000">L???n h??n 4.000.000??</option>
              </select>
            </form>
          </Col>
          <Col
            xxl={{ span: 8, offset: 8 }}
            xl={{ span: 8, offset: 8 }}
            lg={{ span: 8, offset: 8 }}
            md={{ span: 10, offset: 4 }}
            sm={{ span: 12 }}
            xs={{ span: 24 }}
          >
            <form className="body-top_form-right" action="">
              <label className="label-top_right" htmlFor="">
                S???p X???p:
              </label>
              <select
                className="select-option_right"
                autofocus="autofocus"
                name="sapxep"
                id=""
                onChange={handleSelectSort}
              >
                <option value="gia:ASC">S???n Ph???m B??n Ch???y</option>
                <option defaultValue value="tenSP:DESC">
                  Theo B???ng Ch??? C??i T??? A-Z
                </option>
                <option value="tenSP:ASC">Theo B???ng Ch??? C??i T??? Z-A</option>
                <option value="gia:ASC">Gi?? T??? Th???p ?????n Cao</option>
                <option value="gia:DESC">Gi?? T??? Cao ?????n Th???p</option>
                <option value="createdAt:DESC">M???i Nh???t</option>
                <option value="createdAt:ASC">C?? Nh???t</option>
              </select>
            </form>
          </Col>
        </div>
        <div className="body-bottom">
          <ul className="ul-item">
            <Row gutter={[8, 8]}>
              {items.map((item) => {
                // t???o d???u . trong gi?? ti???n
                let Gia = themDauChamVaoGiaTien(item.gia);

                // t???o d???u . trong gi???m gi?? ti???n
                let giamGiaString = "";
                if (item.giamGia) {
                  giamGiaString = themDauChamVaoGiaTien(item.giamGia);
                }

                //t???o % gi???m gi??
                const phanTram = Math.round(
                  (100 - (item.giamGia / item.gia) * 100).toFixed(2)
                );

                return (
                  <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                    <li className="item" key={item.id}>
                      <Link
                        className="item-link"
                        to="/feature/detail"
                        onClick={() => handleClickSendItem(item)}
                      >
                        <div className="item-main">
                          <div className="item-main_div-img">
                            <img
                              className="item-main_img"
                              src={item.anhBia}
                              alt="???nh b??a"
                            />
                            {item.giamGia ? (
                              <div className="notification-sale">
                                <span className="notification-sale_content">
                                  <span>{phanTram}%</span>
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="item-detail">
                            <div className="item-detail_flex">
                              <div className="item-detail_name">
                                {item.tenSP}
                              </div>
                              {item.giamGia ? (
                                <div className="item-detail_price">
                                  <span className="item-detail_price-sale">
                                    {giamGiaString}
                                    <span className="price">??</span>
                                  </span>
                                  <div>
                                    <span className="item-detail_price-real_sale">
                                      {Gia}
                                      <span className="price-sale">??</span>
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p className="item-detail_price-real">
                                  {Gia}
                                  <span className="price">??</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </Col>
                );
              })}
            </Row>
          </ul>
          <PaginationHanmade
            onPageChange1={handlePageChange1}
            onPageChange2={handlePageChange2}
            activeID={idActive}
            pagination={pagination}
            totalItem={totalItem}
          />
        </div>
      </div>
    </body>
  );
}

export default RenderSale;
