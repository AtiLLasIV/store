import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import './App.css'
import { Main } from './components/Main/Main'
import { ProductPage } from './components/ProductPage/ProductPage'
import { EditProductPage } from './components/ProductPage/EditProductPage';
import { Profile } from './components/Profile/Profile'
import { Header } from './components/Header/Header'
import { Cart } from './components/Cart/Cart'
import { useState } from "react";


export function App() {
  const [isAuth, setIsAuth] = useState(false);
  const isAdmin = true;

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/main" />}
        ></Route>
        <Route
          path="/main"
          element={<Main />}
        ></Route>
        <Route
          path="/product/:id"
          element={<ProductPage isAdmin={isAdmin} />}>
        </Route>
        <Route
          path="/edit-product/:id"
          element={<EditProductPage />}>
        </Route>
        <Route
          path="/profile"
          element={<Profile isAuth={isAuth} setIsAuth={setIsAuth} />}
        ></Route>
        <Route
          path="/cart"
          element={<Cart />}
        ></Route>
      </Routes>
    </BrowserRouter>
  )
}
