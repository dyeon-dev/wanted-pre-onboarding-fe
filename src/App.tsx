import { useEffect, useRef, useState } from "react";
import { MOCK_DATA, type MockData } from "./api/mockData";
import "./App.css";

function App() {
  const [products, setProducts] = useState<MockData[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // 현재 페이지 트랙
  const observer = useRef<IntersectionObserver | null>(null); // 스크롤링 트랙

  const itemsPerPage = 10; // 스크롤 당 로드 개수

  const loadProducts = () => {
    if (loading) return;

    setLoading(true); // 로딩 시작

    setTimeout(() => {
      const nextPageData = MOCK_DATA.slice((page-1) * itemsPerPage, page * itemsPerPage); // itemsPerPage씩 분배

      setProducts((prevData) => [...prevData, ...nextPageData]);

      // 현재 가져온 상품 리스트들의 액수들의 합계
      const newTotal = nextPageData.reduce((sum, product) => sum + product.price, 0);
      setTotalPrice((prevTotal) => prevTotal + newTotal);
      
      setLoading(false);  // 로딩 끝 
    }, 1000)
  }

  useEffect(() => {
    loadProducts();
  }, [page]);


  const lastProductRef = useRef<HTMLDivElement | null>(null); // 마지막 스크롤링 감지 

  useEffect(() => {
    // Intersection Observer: 목록의 마지막 제품이 언제 표시되는지 추적 => 페이지 상태가 증가하고 로그할 다음 데이터 배치가 트리거 된다.
    observer.current = new IntersectionObserver(  // 새로운 IntersectionObserver 인스턴스 생성하고 참조에 할당
      (entry) => { // 변화가 감지되었을 때 실행되는 콜백 함수
        if (entry[0].isIntersecting) { // 첫번째 항목(목록의 마지막 제품)이 뷰포트에 보이는지 확인 -> 관찰된 요소가 뷰포트와 교차하는 경우 isIntersecting가 true
          setPage((prevPage) => prevPage + 1) // 다음 페이지의 제품을 로드
        }
      },
      { threshold: 1.0 } // 타겟이 100% 보일 때 트리거
    );


    // 리스트에서 마지막 제품 관찰
    if(lastProductRef.current) {
      observer.current.observe(lastProductRef.current); // 마지막 제품 관찰 시작
    }

    // 정리: 컴포넌트가 언마운트되거나 업데이트될 때 해제하는 클린업 함수
    return () => { // return: 메모리 누수 및 원치 않는 동작을 방지하기 위한 정리 단계 역할
      if(observer.current && lastProductRef.current) { // 관찰자와 마지막 제품 참조가 모두 존재하면
        observer.current.unobserve(lastProductRef.current); // 마지막 제품 관찰 중지
      }
    }
  }, [lastProductRef, products]);

  return (
    <div className="app">
      <h1 className="title">Infinite Scroll</h1>
      <div className="products">
      <h2 className="total">Total Price: ${totalPrice}</h2>
      {products.map((product, index) => {
          if (index === products.length - 1) {
            return (
              <div ref={lastProductRef} key={product.productId} className="product">
                <h3>{product.productName}</h3>
                <p>Price: <span className="price">${product.price}</span></p>
                <p>Date: {new Date(product.boughtDate).toLocaleDateString()}</p>
              </div>
            );
          } else {
            return (
              <div key={product.productId} className="product">
                <h3>{product.productName}</h3>
                <p>Price: <span className="price">${product.price}</span></p>
                <p>Date: {new Date(product.boughtDate).toLocaleDateString()}</p>
              </div>
            );
          }
        })}
      </div>
      {loading && <p className="loading">Loading...</p>}
      <h2 className="total">Total Price: ${totalPrice}</h2>

    </div>
  );
}

export default App;
