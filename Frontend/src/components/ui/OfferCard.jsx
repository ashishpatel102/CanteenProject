import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./OfferCard.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import URL from "../../utils/service";

const OfferBanner = () => {
  const [offers, setOffers] = useState([]);
  const [offersList, setOfferList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  // const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${URL}/admin/offers`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!data.success || !Array.isArray(data.offers)) {
        throw new Error("Invalid response from server");
      }

      setOffers(data.offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  async function OffersData(discount) {

    try {
      const response = await fetch(`${URL}/admin/offers/discount/${discount}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();


      if (!data.success || !Array.isArray(data.offers)) {
        throw new Error("Invalid response from server");
      }

      setOfferList(data.offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  const NextArrow = ({ onClick }) => (
    <div className="next-arrow border" style={{ borderRadius: '5px' }} onClick={onClick}>
      <i className="fa-solid fa-chevron-right"></i>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="prev-arrow border" style={{ borderRadius: '5px' }} onClick={onClick}>
      <i className="fa-solid fa-chevron-left"></i>
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: offers.length > 1,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: offers.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: offers.length > 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="offer-banner">
      {loading && <p className="loading-text">Loading offers...</p>}
      {error && <p className="error-text">{error}</p>}
      {offers.length > 0 ? (
        <Slider {...sliderSettings} className="offer-slider">

          {offers.map((offer, index) => (
            <div key={offer._id || index} className="offer-slide">
              <OfferCard
                offer={offer}
                OffersData={OffersData}
                setModalShow={setModalShow}
              />
            </div>
          ))}

        </Slider>
      ) : (
        !loading && <h1 className="no-offers">No offers available right now.</h1>
      )}

      <MyVerticallyCenteredModal
        show={modalShow}
        offersList={offersList}
        onHide={() => setModalShow(false)}
      // selectedOffer={selectedOffer}
      />
    </div>
  );
}

const OfferCard = ({ offer, setModalShow, OffersData }) => {
  const { title, description, discount, endDate, image } = offer;
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const expiryDate = new Date(endDate);
      const diff = expiryDate - now;

      if (diff <= 0) {
        setTimeLeft("Offer Expired!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="offer-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: `url(${image})`, backgroundSize: '70%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>

      <div className="offer-content text-white" style={{ width: 'max-content', padding: '20px', borderRadius: '5px', height: 'max-content', background: 'rgba(0,0,0,0.2)' }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <h4 className="discount-text">{discount}% OFF</h4>
        <p className="offer-timer">⏳ Ends in: {timeLeft}</p>
        <Button
          variant="primary"
          onClick={() => {

            setModalShow(true);
            OffersData(discount);
          }}
        >
          View Offer
        </Button>
      </div>
    </div>
  );
};

function MyVerticallyCenteredModal({ show, onHide, selectedOffer, offersList }) {
  const navigate = useNavigate();
  const handleBuyNow = (item) => {

    sessionStorage.setItem("CheckoutItem", JSON.stringify(item));
    navigate("/checkout");
  };


  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered custom-modal">
        <div className="modal-content " style={{ width: '100%' }}>
          <div className="modal-header" style={{ width: '90vw' }}>
            <h5 className="modal-title">{selectedOffer ? selectedOffer.title : "Offer Details"}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            {offersList ? (
              <>

                <div className="container col-md-9 col-sm-6 col-12">
                  <div className="row justify-content-center">
                    {offersList.map((item, index) => (
                      <div className="col-md-4 col-sm-6 col-6 d-flex justify-content-center" key={index}>
                        <div className="card shadow" id="Cards" style={{ width: "14rem" }}>
                          <b style={{ position: "absolute", left: '2%', top: '2%', background: 'red', padding: '5px 10px', borderRadius: '5px', color: 'white' }}>{item.discount} %</b>
                          <img
                            src={item.image_url}
                            className="card-img-top"
                            alt={item.name}
                            style={{ height: "150px", objectFit: "cover" }}
                          />
                          <div className="card-body text-center">
                            <h5 className="card-title">Card {index + 1}</h5>
                            <p className="card-text">{item.name}</p>


                            <button onClick={() => handleBuyNow(item)} className="btn btn-sm btn-warning fw-bold">BUY</button>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center">No offer details available.</p>
            )}
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferBanner;
