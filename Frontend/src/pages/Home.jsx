
import logo from '../Food/logo1.png'
import './Home.css'
import { useAuth } from '../AuthContext';
import Copyright from '../components/ui/Copyright'
import useVerify from '../utils/Veryfy';

const Home = () => {
  useVerify();
  const { user, logout } = useAuth();
  return (
    <>
      <div className="container">
        <div className="item item1">
          <div>
            <h1 className='fw-bolder' style={{ fontSize: '3rem' }}>The Western Spoon</h1><br />
            <h4 className='animation'>Desing By : <font className='text-anim '>🦋⃟✮Ashish patel𝄟⃝</font></h4><br />
            <p>
              Welcome to our canteen! A place where flavors meet freshness, and every bite brings joy. From early morning tea to late lunch specials, our canteen serves a wide variety of dishes crafted with care and hygiene. Lorem ipsum dolor sit amet consectetur adipisicing elit. Canteen menus are updated daily with hot meals, snacks, and beverages to satisfy every appetite. Inventore aspernatur quisquam sint et architecto nostrum voluptatum, modi asperiores quaerat omnis ipsum ad unde. Sit, relax, and enjoy a cozy meal at your favorite food corner on campus.
            </p>
            <br />
            <button className='btn'>Read More <i class="fa-solid fa-angle-right fa-flip"></i> </button>
          </div>
        </div>
        <div className="item item2">
          <img src={logo} className='' alt="your browser not supportd" width='100%' />
        </div>

        <div className="item item3 p-0 m-0">
          <div className='grid rounded-3 shadow'>
            {
              [
                { title: 'Fried Rice And Fried Chicken', img: 'https://i.pinimg.com/736x/fd/e9/e2/fde9e2ad5ab1f31ff6d5086bd8361135.jpg' },
                { title: 'Pizza', img: 'https://i.pinimg.com/736x/26/c6/4b/26c64bef44546cdc05bc2233168f32ac.jpg' },
                { title: 'Fresh burger', img: 'https://i.pinimg.com/1200x/17/68/ea/1768ea64918f618d4a9c9be36d4965aa.jpg' },
                { title: 'Paneer Butter Masala indian food', img: 'https://i.pinimg.com/1200x/e4/e6/7b/e4e67b4da284d98559bbfbfc2392d99c.jpg' },
                { title: 'Lychee bundle', img: 'https://i.pinimg.com/736x/17/d8/78/17d8783b4e9fbed14ad73ce742037cdf.jpg' },
                { title: 'Fruit hampers product', img: 'https://i.pinimg.com/736x/43/59/6e/43596eff912d43b824a741bdb9366542.jpg' },
              ].map((item, index) => {
                return <div className='item list' key={index}>
                  <img src={item.img} alt="your browser not support" height='100px' /><br />
                  <b>{item.title}</b>
                </div>
              })
            }
          </div>
        </div>

        <div className="item item4 p-5">
          <div style={{ boxShadow: '0px 0px 10px rgba(0,0,0,.1)', padding: '30px 10px', rotate: '-30deg' }}>
            <br /><br />
            <img src="https://i.pinimg.com/736x/43/59/6e/43596eff912d43b824a741bdb9366542.jpg" alt="your browser not support" height='200px' />
          </div>
          <div style={{ boxShadow: '0px 0px 10px rgba(0,0,0,.1)', padding: '30px 20px', rotate: '-30deg', marginLeft: '-20px', marginTop: '20px' }}>
            <img src="https://i.pinimg.com/736x/17/d8/78/17d8783b4e9fbed14ad73ce742037cdf.jpg" alt="your browser not support" height='200px' />
          </div>
        </div>

        <div className="item item5">
          <div>
            <h1 className='fw-bold'>We Deliver Food Within 30 Min</h1>
            <p className="text-muted">
              Enjoy freshly prepared meals delivered straight to your doorstep in under 30 minutes. Fast, tasty, and always on time — because your hunger shouldn't have to wait!
            </p>
            <br />
            <button className='btn'> <i class="fa-solid fa-download fa-bounce"></i> Order Now </button>
            <button className='btn m-2'> More Info <i class="fa-solid fa-angle-right fa-flip"></i></button>
          </div>

        </div>

        <div className='item item6 p-3 mt-5'>
          <div>
            <h1 className='fw-bolder'>Taste The Best That <br />Surprise You</h1>
            <p>
              Discover the rich flavors of our canteen's special recipes, crafted with love and the freshest ingredients.
              From crispy samosas and cheesy sandwiches to spicy pav bhaji and creamy paneer butter masala — every bite brings
              back the taste of home. Whether you're here for a quick snack or a full meal, our chefs ensure quality, hygiene,
              and unforgettable taste in every dish. Come hungry, leave happy!
            </p>
            <b>$15.00</b>
            <br />
            <br />
            <button className='btn p-2' style={{ width: '80%' }}>Buy Now</button>
          </div>

        </div>
        <div className='item item7'>
          <img src="https://i.pinimg.com/736x/2d/33/19/2d331933ad8139b48fb991f2a1428c68.jpg" alt="your browser not support" width='300px' />
        </div>
        <div className='item item8 p-0 m-0'>
          <Copyright />
        </div>
      </div>
    </>
  )
}

export default Home;