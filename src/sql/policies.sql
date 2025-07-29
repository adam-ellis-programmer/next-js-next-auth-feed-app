-- Check your current INSERT policy
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'posts' 
AND schemaname = 'public' 
AND cmd = 'INSERT';

-- View all policies on posts table
SELECT 
    policyname AS "Policy Name",
    cmd AS "Command",
    CASE 
        WHEN cmd = 'r' THEN 'SELECT'
        WHEN cmd = 'a' THEN 'INSERT' 
        WHEN cmd = 'w' THEN 'UPDATE'
        WHEN cmd = 'd' THEN 'DELETE'
        WHEN cmd = '*' THEN 'ALL'
    END AS "Operation",
    qual AS "USING Expression",
    with_check AS "WITH CHECK Expression"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'posts'
ORDER BY policyname;


-- View your custom function
SELECT 
    proname AS "Function Name",
    pg_get_function_result(oid) AS "Returns",
    pg_get_function_arguments(oid) AS "Arguments",
    prosrc AS "Function Body"
FROM pg_proc 
WHERE proname = 'update_updated_at_column';


-- View all triggers on posts table
SELECT 
    trigger_name AS "Trigger Name",
    event_manipulation AS "Event",
    action_timing AS "Timing",
    action_statement AS "Action"
FROM information_schema.triggers 
WHERE event_object_table = 'posts'
AND event_object_schema = 'public';


-- View indexes on posts table
SELECT 
    indexname AS "Index Name",
    indexdef AS "Index Definition"
FROM pg_indexes 
WHERE tablename = 'posts' 
AND schemaname = 'public';


-- See everything about posts table
SELECT 
    'RLS Status' AS "Type",
    CASE 
        WHEN rowsecurity THEN 'ENABLED' 
        ELSE 'DISABLED' 
    END AS "Value"
FROM pg_tables 
WHERE tablename = 'posts' AND schemaname = 'public'

UNION ALL

SELECT 
    'Policy Count' AS "Type",
    COUNT(*)::text AS "Value"
FROM pg_policies 
WHERE tablename = 'posts' AND schemaname = 'public'

UNION ALL

SELECT 
    'Trigger Count' AS "Type",
    COUNT(*)::text AS "Value"
FROM information_schema.triggers 
WHERE event_object_table = 'posts' AND event_object_schema = 'public'

UNION ALL

SELECT 
    'Index Count' AS "Type",
    COUNT(*)::text AS "Value"
FROM pg_indexes 
WHERE tablename = 'posts' AND schemaname = 'public';