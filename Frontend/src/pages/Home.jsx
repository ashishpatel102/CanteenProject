import '@fortawesome/fontawesome-free/css/all.min.css';
import './Home.css'
import foods from '../Food/foods.png'
import food_man from '../Food/food-man.png'
import download_app from '../Food/download-app.png'
import { useEffect, useState, useRef } from 'react';
import Card from '../components/ui/Card';
import CanvasAnimation from '../components/ui/CanvasAnimation';
import { useAuth } from '../AuthContext';
import useVerify from '../utils/Veryfy';
import URL from '../utils/service';



const Home = () => {
  useVerify();
  const [menuItems, setMenuItems] = useState([]);
  const scrollRef = useRef(null);
  const { user, logout } = useAuth();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${URL}/menu`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setMenuItems(data.data);
        } else {
          console.log("No menu items found.");
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <>
      <div className='canvas-hide'>

        <div
          className=" home-box vh-100 d-flex flex-column align-items-center justify-content-center text-center px-3"
          style={{ background: "linear-gradient(black 60%, rgba(69, 255, 69, 0.4))", position: "relative" }}
        >
          <CanvasAnimation />

          <div>
            {!user && <div className="d-flex flex-wrap justify-content-center gap-3 mt-3" style={{ position: 'absolute', top: '60%', left: '40%' }}>
              <a href="/login"><button className="btn btn-primary btn-lg px-4 py-2" style={{ cursor: 'pointer' }}>Login</button></a>
              <a href="/signup"><button className="btn btn-success btn-lg px-4 py-2" style={{ cursor: 'pointer' }}>Sign Up</button></a>
            </div>}
            <h1
              className="text-white fw-bold"
              style={{ fontSize: "4rem", maxWidth: "90vw", wordWrap: "break-word", fontFamily: 'cursive' }}
            >
              CANTEEN MANAGEMENT
            </h1>

          </div>
        </div>
      </div>
      <div className='home-box box-hide' style={{ background: 'rgba(69, 255, 69, 0.4)' }}>

        <div className='left'>
          <div style={{ width: '60%' }}>
            <h1><font className="text-white"> FRESH FOOD </font> WITH GREAT TASTE</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium maxime ipsum corrupti dignissimos eveniet soluta! Explicabo nobis labore optio qui vel</p>
            <div className='btn1-btn2'>
              <button className='btn1'>Shop Now</button>
              <button className='btn2'>Order Food</button>
            </div>
          </div>
        </div>
        <div className='right hidden'>
          <img src={foods} alt=" Food Image" />
        </div>
      </div>

      <div className='box' style={{ background: 'linear-gradient(rgba(69, 255, 69, 0.4),rgba(255, 255, 255, 0.4))' }}>

        <i className="fa-solid fa-chevron-left scroll-left" onClick={scrollLeft}></i>
        <div className='card-container' ref={scrollRef}>

          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <div key={index} className="scroll-item">
                <Card item={item} index={index} />
              </div>
            ))
          ) : (
            <p>Loading menu items...</p>
          )}
        </div>

        <br />
        <i className="fa-solid fa-chevron-right scroll-right" onClick={scrollRight}></i>
      </div>

      <div className='home-box' style={{ background: 'none' }}>
        <div className='left'>
          <img src={food_man} alt="food-man" width={'70%'} />
        </div>

        <div className='right p-4'>
          <div className='border p-3' style={{ padding: '30px', borderRadius: '5px' }}>
            <a href="#">Learn About Wellfood</a>
            <h2>Amazing & Quality Food For Your Good Health</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates quaerat laboriosam nulla illum excepturi eaque magnam impedit, magni ipsam id perferendis dicta recusandae mollitia praesentium laudantium, deserunt nobis possimus similique.</p>
            <button className='btn border'>Learn More Us</button>
            <button className='btn border bg-dark text-white m-2'>Explore Popular menu</button>
          </div>
        </div>
      </div>

      <div className='box'>
        <div style={{ textAlign: 'center' }}>
          <font><i className="fa-solid fa-hand-holding-heart"></i>FOODS MENU<i className="fa-solid fa-hand-holding-heart"></i></font>
          <h2>Choose Your Best Food</h2>
          <hr />
          <div className='cards'>
            {menuItems.length > 0 ? (
              menuItems.map((item, index) => (
                <div key={index} className="scroll-item">
                  <Card item={item} index={index} />
                </div>
              ))
            ) : (
              <p>Loading menu items...</p>
            )}
          </div>
        </div>
      </div>

      <div className='buttom'>
        <div className='div'>
          <h2>Download Our App On Play Store</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro, reprehenderit sit aperiam illum ea voluptatem dicta inventore</p>
          <button className='btn3'><i className="fa-brands fa-apple"></i> Download On the<br />App Store</button>
          <button className='btn3'><i className="fa-brands fa-google-play"></i> Get it on<br />Google Play Store</button>
        </div>
        <div className='hidden'>
          <img src={download_app} alt="download_app not found" />
        </div>
      </div>
    </>
  );
};

export default Home;
