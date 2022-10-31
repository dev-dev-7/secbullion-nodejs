PROJECT_ID=cardz-ly 

PROJECT_NUMBER=$(gcloud projects list \
  --format="value(projectNumber)" \
  --filter="projectId=${PROJECT_ID}")

gcloud iam service-accounts add-iam-policy-binding \
    gke-user@cardz-ly.iam.gserviceaccount.com \
    --member=serviceAccount:gke-user@cardz-ly.iam.gserviceaccount.com \
    --role=roles/iam.serviceAccountUser \
    --project=${PROJECT_ID}