MARKER:__PROVIDERS_IMPORT__
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
---
MARKER:__PROVIDERS_INIT__
const [queryClient] = useState(() => makeQueryClient());
---
MARKER:__PROVIDERS_WRAP_START__
<QueryClientProvider client={queryClient}>
---
MARKER:__PROVIDERS_WRAP_END__
</QueryClientProvider>
