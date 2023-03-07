import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

const LIST_TYPE = [
  {
    value: "",
    label: "---All---",
  },
  {
    value: "Apple",
    label: "Apple",
  },
  {
    value: "Samsung",
    label: "Samsung",
  },
  {
    value: "OPPO",
    label: "OPPO",
  },
  {
    value: "Huawei",
    label: "Huawei",
  },
  {
    value: "Infinix",
    label: "Infinix",
  },
];

function App() {
  const [lisProduct, setListProduct] = useState([]);
  const [lisProductFromApi, setListProductFromApi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keySearch, setKeySearch] = useState("");
  const [brandtypeSearch, setBrandtypeSearch] = useState("");

  const getListProdcts = async (keySearch, brandtypeSearch) => {
    setIsLoading(true);
    await fetch("https://dummyjson.com/products?limit=20")
      .then((res) => res.json())
      .then(
        (result) => {
          handleSearchProducts(result.products, keySearch, brandtypeSearch);
          setListProductFromApi(result.products);
        },
        (error) => {}
      );
    setIsLoading(false);
  };

  const handleSearchProducts = (listProducts, keySearch, brandtypeSearch) => {
    const listTemp = listProducts.filter(
      (item) =>
        item.title.includes(keySearch) &&
        (brandtypeSearch === item.brand || brandtypeSearch === "")
    );
    setListProduct(listTemp);
  };

  const handleReload = () => {
    //save data in session storage
    sessionStorage.setItem("brandSearh", brandtypeSearch);
    sessionStorage.setItem("keySearch", keySearch);
  };

  const handleSetDefaultData = () => {
    //handle set data search from session storage
    setKeySearch(sessionStorage.getItem("keySearch") ?? "");
    setBrandtypeSearch(sessionStorage.getItem("brandSearh") ?? "");
  };

  //event to handle reload page save data
  window.addEventListener("beforeunload", handleReload);

  useEffect(() => {
    handleSetDefaultData();
    getListProdcts(
      sessionStorage.getItem("keySearch") ?? "",
      sessionStorage.getItem("brandSearh") ?? ""
    );

    //clear event
    return window.removeEventListener("beforeunload", () => handleReload);
  }, []);

  return (
    <div className="App">
      <div className="search-contain">
        <h3>Title</h3>
        <div className="wapper-search">
          <select
            name="select-type"
            onChange={(event) => setBrandtypeSearch(event.target.value)}
            value={brandtypeSearch}
          >
            {LIST_TYPE.map((item, idx) => (
              <option key={idx} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={keySearch}
            onChange={(event) => setKeySearch(event.target.value)}
          />
          <button
            onClick={() =>
              handleSearchProducts(
                lisProductFromApi,
                keySearch,
                brandtypeSearch
              )
            }
          >
            Search by Brand and Title
          </button>
        </div>
      </div>
      {isLoading === false ? (
        <div className="table-container">
          <table>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Brand</th>
              <th>Description</th>
              <th>Price</th>
              <th>Rating</th>
              <th>stock</th>
            </tr>
            {lisProduct.map((item, idx) => (
              <tr key={idx}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.brand}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.rating}</td>
                <td>{item.stock}</td>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <div className="table-container">Loading...</div>
      )}
    </div>
  );
}

export default App;
