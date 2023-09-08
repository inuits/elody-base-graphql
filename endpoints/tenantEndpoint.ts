import express, {Express} from "express";
declare module "express-session" {
  interface SessionData {
    tenant: string | undefined;
  }
}
export const applyTenantEndpoint = (app: Express) => {
  app.use(express.json());
  
  app.get("/api/tenant", async (req, res) => {
    res.status(200).json(req.session.tenant);
  });

  app.post("/api/tenant", async (req, res) => {
   req.session.tenant = req.body.tenant;
   res.status(200).end("tenant set");
  });
}