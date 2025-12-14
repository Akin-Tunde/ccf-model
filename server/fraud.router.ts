// --- File: akin-tunde-ccf-model/server/fraud.router.ts (Full Fixed Code) ---

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAvailableModels,
  getFeatureNames,
  getModelMetrics,
  predictFraud, // <-- Now returns a Promise
} from "./ml";
import { getDb } from "./db";
import { fraudPredictions } from "../drizzle/schema";

const featureInputSchema = z.record(z.string(), z.number());

export const fraudRouter = router({
  getModels: publicProcedure.query(() => {
    return getAvailableModels();
  }),

  getMetrics: publicProcedure.query(() => {
    return getModelMetrics();
  }),

  getFeatures: publicProcedure.query(() => {
    return getFeatureNames();
  }),

  predict: publicProcedure
    .input(
      z.object({
        modelName: z.string(),
        features: featureInputSchema,
      })
    )
    // --- FIX: Add 'async' to the function and 'await' to the call ---
    .mutation(async ({ input, ctx }) => { 
      const result = await predictFraud(input.modelName, input.features); 

      // Save prediction to database if user is authenticated
      if (ctx.user) {
        try {
          const db = await getDb();
          if (db) {
            await db.insert(fraudPredictions).values({
              userId: ctx.user.id,
              modelName: input.modelName,
              prediction: result.prediction,
              confidence: result.confidence,
              features: JSON.stringify(input.features),
            });
          }
        } catch (error) {
          console.error("Failed to save prediction:", error);
        }
      }

      return result;
    }),
});