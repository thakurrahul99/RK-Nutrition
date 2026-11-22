import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductDetailPage from '../components/shop/ProductDetailPage';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { isAuthenticated } = useAuth();

  const product = getProductById(productId);

  if (!product || (product.status === 'draft' && !isAuthenticated)) {
    return (
      <div className="min-h-[70vh] bg-[#111111] text-[#F5F4F2] flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="font-heading text-3xl uppercase font-bold text-[#F5F4F2]">
            Product Not Found
          </h2>
          <p className="text-sm text-[#8C8C8C]">
            The product specification you are searching for is not currently in our catalogue.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E11D2E] text-[#F5F4F2] font-heading uppercase tracking-wider text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Products</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPage
      product={product}
      onBackToShop={() => navigate('/products')}
    />
  );
}
