import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MarketplaceBuyer from "./MarketplaceBuyer";
import MarketplaceSeller from "./MarketplaceSeller";
import { secureStorage } from "@/utils/storage";

const MarketplaceRouter = () => {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  useEffect(() => {
    const storedRole = secureStorage.getRole();
    console.log("MarketplaceRouter: initializing role", { storedRole });
    if (storedRole) {
      setRole(storedRole);
      console.log("MarketplaceRouter: set role from secureStorage", storedRole);
    }
  }, []);

  const handleSetRole = (newRole: "buyer" | "seller") => {
    console.log("MarketplaceRouter: role switch", { from: role, to: newRole });
    setRole(newRole);
    secureStorage.setRole(newRole);
  };

  console.log("MarketplaceRouter: rendering", { role });

  return (
    <div className="pb-20">
      {role === "buyer" ? <MarketplaceBuyer /> : <MarketplaceSeller />}
    </div>
  );
};

export default MarketplaceRouter;
