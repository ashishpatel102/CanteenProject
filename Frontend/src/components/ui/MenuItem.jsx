import { useEffect, useState } from "react";
import Card from "./Card";
import verify from "../../utils/Veryfy";
import { useCart } from "../../CartContext";
import "./MenuItem.css";
import OfferCards from "./OfferCard";
import URL from "../../utils/service";

// const MenuItem = () => {
//   const [items, setItems] = useState([]);
//   const { updateCart } = useCart();

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const response = await fetch(`${URL}/menu`, {
//           method: "GET",
//           credentials: "include",
//         });

//         const data = await response.json();

//         if (!data.data || data.data.length === 0) {
//           console.log("No data received");
//         } else {
//           setItems(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching menu:", error);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   verify("/menu");

//   if (items.length === 0) return <div className="vh-100"><h1 className="text-center">Data Not Found</h1></div>;

//   const categorizedItems = items.reduce((acc, item) => {
//     if (!acc[item.category]) {
//       acc[item.category] = [];
//     }
//     acc[item.category].push(item);
//     return acc;
//   }, {});



//   return (
//     <div className="menu-container">
//       <OfferCards />
//       {Object.keys(categorizedItems).map((category, catIndex) => (
//         <div key={catIndex} className="category-section">
//           <h3 className="category-title">{category}</h3>
//           <div className="scroll-container">
//             {categorizedItems[category].map((item, index) => (
//               <div key={index} className="scroll-item">
//                 <Card item={item} updateCart={updateCart} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MenuItem;


const MenuItem = () => {
  const [items, setItems] = useState([]);
  const { updateCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${URL}/menu`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          console.log("No data received");
        } else {
          setItems(data.data);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenuItems();
  }, []);

  verify("/menu");

  if (items.length === 0) return <div className="vh-100"><h1 className="text-center">Data Not Found</h1></div>;

  const categorizedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});



  return (
    <div>
      {/* <OfferCards /> */}

      <div className="minu-container container">
        {Object.keys(categorizedItems).map((category, catIndex) => (
          categorizedItems[category].map((item, index) => {
            return (
              <Card item={item} key={index} updateCart={updateCart} />
            )
          })

        ))}
      </div>
    </div>
  );
};

export default MenuItem;
