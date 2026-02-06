-- One-time normalization for repositories.use_case values.
UPDATE repositories
SET use_case = 'saas'
WHERE lower(use_case) = 'saas';

UPDATE repositories
SET use_case = 'ai-ml'
WHERE lower(use_case) IN ('ai', 'ai/ml', 'ai-ml', 'aiml');

UPDATE repositories
SET use_case = 'backend'
WHERE lower(use_case) = 'backend';

UPDATE repositories
SET use_case = 'frontend'
WHERE lower(use_case) = 'frontend';

UPDATE repositories
SET use_case = 'devops'
WHERE lower(use_case) IN ('devops', 'dev-ops');

UPDATE repositories
SET use_case = 'devtools'
WHERE lower(use_case) IN ('devtools', 'dev-tools', 'tools', 'tooling');

UPDATE repositories
SET use_case = 'mobile'
WHERE lower(use_case) = 'mobile';

UPDATE repositories
SET use_case = 'auth'
WHERE lower(use_case) = 'auth';

UPDATE repositories
SET use_case = 'database'
WHERE lower(use_case) IN ('database', 'db');

UPDATE repositories
SET use_case = 'cli'
WHERE lower(use_case) = 'cli';

UPDATE repositories
SET use_case = 'api'
WHERE lower(use_case) = 'api';

UPDATE repositories
SET use_case = 'other'
WHERE lower(use_case) = 'other';
