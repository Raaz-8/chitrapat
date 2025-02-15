import { collection, doc, query, where, getDocs, updateDoc, runTransaction } from "firebase/firestore";

export async function getNextId(db, movieId) {
  const counterRef = doc(db, "review_data", movieId); // Reference to the document using movieId

  try {
    const nextReviewId = await runTransaction(db, async (transaction) => {
      const movieDoc = await transaction.get(counterRef);

      // If the document doesn't exist, initialize the counter
      if (!movieDoc.exists()) {
        // Create document with initial review_id as 1 and rate_count as 1
        transaction.set(counterRef, {
          review_id: 1,
          rate_count: 1
        });
        return 1; // Return initial review_id
      }

      // If document exists, get the current review_id and increment it
      const currentReviewId = movieDoc.data().review_id;
      const currentRateCount = movieDoc.data().rate_count;

      // Increment review_id and rate_count
      const newReviewId = currentReviewId + 1;
      const newRateCount = currentRateCount + 1;

      // Update the review_id and rate_count in the document
      transaction.update(counterRef, {
        review_id: newReviewId,
        rate_count: newRateCount
      });

      return newReviewId; // Return incremented review_id
    });

    console.log("Next review_id:", nextReviewId); // Log the next review_id
    return nextReviewId; // Return the incremented review_id
  } catch (error) {
    console.error("Error getting the next review_id:", error);
    throw error; // Throw error to propagate it to the caller
  }
}

