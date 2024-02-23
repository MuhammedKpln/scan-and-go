import { z } from "zod";

export default z.object({
  fromId: z.string().uuid(),
  toId: z.string().uuid(),
  roomId: z.string().uuid().optional(),
  message: z.string(),
});
