import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const customerRef = doc(db, "customers", user.uid);
        const subscriptionsRef = collection(customerRef, "subscriptions");
        const querySnapshot = await getDocs(subscriptionsRef);

        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start:
              subscription.data().current_period_start.seconds,
          });
        });
      } catch (error) {
        console.error("Error fetching subscription: ", error);
      }
    };

    if (user?.uid) {
      fetchSubscription();
    }
  }, [user?.uid]);

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

  // console.log(products);
  // console.log(subscription);

  const loadCheckout = async (priceId) => {
    const customerRef = doc(db, "customers", user.uid);

    try {
      const checkoutRef = await addDoc(
        collection(customerRef, "checkout_sessions"),
        {
          price: priceId,
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        }
      );

      onSnapshot(checkoutRef, async (snap) => {
        const { error, sessionId } = snap.data();
        if (error) {
          alert(`An error occurred: ${error.message}`);
        }
        if (sessionId) {
          const stripe = await loadStripe(
            "pk_test_51Q6bsK02q0XRsQMHQAJVtKVfY0Rtxq9bWCpYUfXuh9FTn7RjskHVv2s1Pl4N2bhsqO03o9czJiJ06lxBpYH1gInM00dUokyH58"
          );
          stripe.redirectToCheckout({ sessionId });
        }
      });
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  return (
    <div className="plansScreen">
      <br />
      {subscription && (
        <p>
          Renewal Date:
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);

        return (
          <div
            className={`${
              isCurrentPackage && "plansScreen_plan--disabled"
            } plansScreen_plan`}
            key={productId}
          >
            <div className="planScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              className="plansScreen_subscribing"
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribing"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
