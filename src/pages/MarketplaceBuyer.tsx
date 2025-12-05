import Marketplace from "./Marketplace";

// Buyer-facing marketplace page: browse listings from sellers only
const MarketplaceBuyer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">Marketplace</h1>
          <p className="text-muted-foreground">Browse waste listings available from sellers</p>
          <p className="text-xs text-muted-foreground mt-1">
            To request collection, use the Request Collection page. Sellers will be notified.
          </p>
        </header>
        <Marketplace />
      </div>
    </div>
  );
};

export default MarketplaceBuyer;
