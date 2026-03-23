MARKER:__PROVIDERS_IMPORT__
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
---
MARKER:__PROVIDERS_WRAP_START__
<QueryClientProvider client={getQueryClient()}>
---
MARKER:__PROVIDERS_WRAP_END__
</QueryClientProvider>
