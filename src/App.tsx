import { useEffect, useState } from "react";
import { MOCK_DATA, type MockData } from "./api/mockData";


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
      }, 1000)
    }

    useEffect(() => {
      getMockData()
    }, []);

    return (
        <div className="App">
            <h1>Infinite Scroll</h1>
            <div className="products">
            <h2>Total Price: ${totalPrice}</h2>
                {products.map(product => (
                    <div key={product.productId} className="product">
                        <h3>{product.productName}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Date: {new Date(product.boughtDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default App;