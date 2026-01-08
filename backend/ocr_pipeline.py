import cv2, numpy as np, pytesseract, requests, json, re
from datetime import datetime

class MedicalPipeline:
    def __init__(self):
        self.ollama = "http://localhost:11434"
        self.extraction_model = "gemma:2b"
        self.medical_model = "OussamaELALLAM/MedExpert"

    def preprocess(self, path):
        img = cv2.imread(path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        denoise = cv2.fastNlMeansDenoising(gray)
        kernel = np.array([[-1,-1,-1],[-1,9,-1],[-1,-1,-1]])
        sharp = cv2.filter2D(denoise, -1, kernel)
        return cv2.createCLAHE(2.0).apply(sharp)

    def extract_text(self, path):
        img = self.preprocess(path)
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        words = [data["text"][i] for i in range(len(data["text"]))
                 if int(data["conf"][i]) > 30 and data["text"][i].strip()]
        return " ".join(words)

    def call_llm(self, model, prompt):
        body = {
            "model": model, 
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.2}
        }
        try:
            r = requests.post(f"{self.ollama}/api/generate", json=body)
            out = r.json().get("response", "")
            
            # Regex to find JSON block
            match = re.search(r'\{.*\}', out, re.DOTALL)
            if match:
                cleaned = match.group(0)
                return json.loads(cleaned)
            
            # Fallback: try parsing entire string if regex fails (unlikely for objects)
            return json.loads(out)
            
        except Exception as e:
            return {"raw": out if 'out' in locals() else str(e), "error": "invalid json"}

    def extract_json(self, text):
        prompt = f"""
Extract ALL information from this medical report text:

{text}

Return JSON ONLY:
{{
  "meta": {{
    "hospital": "",
    "address": "",
    "report_type": "",
    "patient_name": "",
    "age": "",
    "gender": "",
    "doctor": "",
    "additional_info": ""
  }},
  "tests": [
    {{ "name": "", "value": "", "unit": "", "reference_range": "", "status": "" }}
  ],
  "raw_text": {json.dumps(text)}

}}
"""
        return self.call_llm(self.extraction_model, prompt)

    def analyze(self, extracted_json):
        prompt = f"""
You are a medical expert. Analyze this structured JSON:

{json.dumps(extracted_json)}

Return JSON with:
{{
 "summary": "",
 "abnormal_findings": [
   {{
     "test": "",
     "value": "",
     "normal_range": "",
     "interpretation": "",
     "possible_causes": "",
     "recommended_actions": ""
   }}
 ],
 "general_health_advice": "",
 "when_to_see_doctor": ""
}}
"""
        return self.call_llm(self.medical_model, prompt)

    def run(self, filepath):
        text = self.extract_text(filepath)
        structured = self.extract_json(text)
        medical = self.analyze(structured)

        return {
            "structured": structured,
            "analysis": medical,
            "time": datetime.now().isoformat()
        }
