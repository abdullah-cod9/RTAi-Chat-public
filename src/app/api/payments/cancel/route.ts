import { dodopayments } from "@/lib/DODO/dodopayments";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    // const email = data.user.email;
    const subscriptionId = body.subscriptionId;

    const response = await dodopayments.subscriptions.update(subscriptionId, {
      status: "cancelled",
      metadata: {}, // metadata can be sent here
    });
  
    console.log(response);
    // Step 2: Update database
    // const result = await updateSubscription(subscriptionId);

    // if (!result) {
    //   return NextResponse.json(
    //     { error: result.error?.message },
    //     { status: result.error?.status },
    //   );
    // }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled and database updated successfully",
    });
  } catch (error) {
    console.error("Error during subscription cancellation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
