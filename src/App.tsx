import { useEffect, useState } from "react";
import { MOCK_DATA, type MockData } from "./api/mockData";
import "./App.css";

function App() {
  const [products, setProducts] = useState<MockData[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const getMockData = () => {
    setLoading(true);

    setTimeout(() => {
      const fetchDate = MOCK_DATA;
      setProducts(fetchDate);

      // 전체 price 합산
      const total = fetchDate.reduce((sum, product) => sum + product.price, 0);
      setTotalPrice(total);

      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getMockData();
  }, []);

  return (
    <div className="app">
      <h1 className="title">Infinite Scroll</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product.productId} className="product">
            <h3>{product.productName}</h3>
            <p>
              Price: <span className="price">${product.price}</span>
            </p>
            <p>Date: {new Date(product.boughtDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {loading && <p className="loading">Loading...</p>}
      <h2 className="total">Total Price: ${totalPrice}</h2>
    </div>
  );
}

export default App;
