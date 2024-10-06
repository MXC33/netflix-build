import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = collection(db, "products");
      const activeProductsQuery = query(
        productsRef,
        where("active", "==", true)
      );

      const querySnapshot = await getDocs(activeProductsQuery);
      const products = {};
      querySnapshot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data();
        const pricesRef = collection(productDoc.ref, "prices");
        const priceSnap = await getDocs(pricesRef);
        priceSnap.docs.forEach((price) => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data(),
          };
        });
      });
      setProducts(products);
    };

    fetchProducts();
  }, []);

  console.log(products);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("costumers")
      .doc(user.uid.collection(""))
      .add({
        price: priceId,
        sucess_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapShit(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe();
      }
    });
  };

  return (
    <div className="plansScreen">
      {Object.entries(products).map(([productId, productData]) => {
        return (
          <div className="plansScreen_plan" key={productId}>
            {" "}
            {}
            <div className="planScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadCheckout(productData.prices.priceId)}>
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
