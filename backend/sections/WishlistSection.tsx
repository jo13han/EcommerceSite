{wishlistProducts.map((product) => {
  if (!product) return null; // Skip if product is undefined
  return (
    <Card
      key={product._id || product.productId}
      productId={product._id || product.productId}
      image={product.image}
      title={product.title}
      price={product.price}
      originalPrice={product.originalPrice}
      rating={product.rating}
      reviewCount={product.reviewCount}
      discountPercentage={product.discountPercentage}
    />
  );
})} 