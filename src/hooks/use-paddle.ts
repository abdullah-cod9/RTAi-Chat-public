import {
    Paddle,
    initializePaddle,
    PaddleSetupOptions,
    PricePreviewParams,
    PricePreviewResponse,
  } from "@paddle/paddle-js";
  import { useEffect, useState } from "react";
  
  interface PaddleHookOptions {
    environment: "sandbox" | "production";
    token: string;
    eventCallback?: (data: unknown) => void;
    checkoutSettings?: {
      successUrl?: string;
    };
  }
  
 export interface CheckoutOptions {
    items: {
      priceId: string;
      quantity?: number;
    }[];
    customer?: {
      email: string;
      address?: {
        countryCode: string;
        postalCode: string;
        region: string;
        city: string;
        firstLine: string;
      };
    };
    settings?: {
      displayMode?: "overlay" | "inline";
      theme?: "light" | "dark";
      locale?: string;
    };
  }
  
  interface ProductPrices {
    [key: string]: string;
  }
  
  interface ProductDetails {
    productId: string;
    monthlyPriceId: string;
    yearlyPriceId: string;
  }
  
  const usePaddle = (options: PaddleHookOptions) => {
    const [paddle, setPaddle] = useState<Paddle | undefined>();
    const [productPrices, setProductPrices] = useState<ProductPrices>({});
    const [billingCycle, setBillingCycle] = useState<"month" | "year">("year");
  
    useEffect(() => {
      const initPaddle = async () => {
        try {
          const paddleInstance = await initializePaddle(
            options as PaddleSetupOptions
          );
          setPaddle(paddleInstance);
        } catch (error) {
          console.error("Error initializing Paddle:", error);
        }
      };
  
      initPaddle();
    }, [options]);
  
    const openCheckout = (checkoutOptions: CheckoutOptions) => {
      if (paddle) {
        paddle.Checkout.open(checkoutOptions);
      } else {
        console.error("Paddle not initialized");
      }
    };
  
    const getPrices = (
      productDetails: ProductDetails[],
      cycle: "month" | "year"
    ) => {
      if (paddle) {
        setBillingCycle(cycle);
  
        const itemsList = productDetails.map((product) => ({
          quantity: 1,
          priceId:
            cycle === "month" ? product.monthlyPriceId : product.yearlyPriceId,
        }));
  
        const request: PricePreviewParams = {
          items: itemsList,
        };
  
        paddle
          .PricePreview(request)
          .then((result: PricePreviewResponse) => {
            const items = result.data.details.lineItems;
            const prices: ProductPrices = {};
  
            for (const item of items) {
              const productId = productDetails.find(
                (product) =>
                  product.monthlyPriceId === item.price.id ||
                  product.yearlyPriceId === item.price.id
              )?.productId;
  
              if (productId) {
                prices[productId] = item.formattedTotals.subtotal;
                // console.log(`${productId}: ${item.formattedTotals.subtotal}`);
              }
            }
  
            setProductPrices(prices);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // console.error("Paddle not initialized");
      }
    };
  
    return {
      paddle,
      openCheckout,
      getPrices,
      productPrices,
      billingCycle,
      setBillingCycle,
    };
  };
  
  export default usePaddle;