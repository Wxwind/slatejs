## TODO
  1. aggregate
  2. joints
  3. ccd
  4. raycast(rayCast(all) / boxCast(all) / capsuleCast(all) / sphereCast(all) / lineCast)
  5. overlapTest(overlapBox / overlapSphere / overlapCapsule)
  6. pass id to native pxShape to avoid using map<shape ptr, shape id>
  7. layer mask support for scene query
## Known Bugs
  1.
## FEATURE
  1. static / dynamic rigidbody
  2. box / sphere / capsule collider
  3. capsule character controller
  4. trigger / contact (enter / stay / exit) event callback
  5. support trigger-trigger events (PxSceneFlag::eDEPRECATED_TRIGGER_TRIGGER_REPORTS has been deprecated in 4.x.So the workaround is to use onContact to emulate triggers, and this supports trigger-trigger notifications and CCD, see SnippetTriggers in physX source code)
