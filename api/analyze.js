export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { audioData, metadata } = req.body;
    
    // In a real scenario, if Claude supports native audio, we pass audioData.
    // Assuming 'audioData' is a base64 string and Claude handles it, or we pass metadata for now.
    
    const anthropicApiKey = process.env.VITE_ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      throw new Error("Missing VITE_ANTHROPIC_API_KEY");
    }

    const systemPrompt = `당신은 '도미도미(Domidomi)'라는 개인 AI 피아노 연습 코치입니다.
사용자의 연주 데이터(혹은 오디오 메타데이터)를 분석하여 따뜻하고 격려하는 선생님의 톤으로 피드백을 제공해야 합니다.
반드시 아래 8가지 평가 지표에 대해 1부터 10까지의 점수(정수)를 매기고, 'comment' 필드에 종합적인 조언을 남겨주세요.
응답은 반드시 유효한 JSON 형식이어야 합니다.

8가지 지표:
- rhythm: 박자감 (1-10)
- pitch: 음정 정확도 (1-10)
- dynamics: 다이나믹스 (1-10)
- pedal: 페달 사용 (1-10)
- evenness: 균일성 (1-10)
- leftHand: 왼손 완성도 (1-10)
- rightHand: 오른손 완성도 (1-10)
- expression: 표현력 (1-10)

JSON Format:
{
  "rhythm": 8,
  "pitch": 9,
  "dynamics": 7,
  "pedal": 8,
  "evenness": 7,
  "leftHand": 8,
  "rightHand": 8,
  "expression": 9,
  "comment": "정말 훌륭한 연주였어요! 특히 오른손의 멜로디 라인이 아주 예쁘게 표현되었습니다. 페달을 조금만 더 깔끔하게 밟아주면 더욱 완벽해질 거예요. 화이팅!"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `여기 연주 데이터가 있습니다: ${JSON.stringify(metadata)}. 연주를 평가하고 JSON 형태로 반환해 주세요.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', errorData);
      
      // Fallback dummy data if API fails (useful for UI testing without real key)
      if (response.status === 401 || response.status === 404) {
        return res.status(200).json({
          rhythm: 7, pitch: 8, dynamics: 6, pedal: 7, evenness: 6,
          leftHand: 7, rightHand: 8, expression: 7,
          comment: "[API Key 오류 또는 모델명 오류 데모 피드백] 연주가 참 좋네요! 계속 연습해 봅시다."
        });
      }
      return res.status(response.status).json({ error: 'Failed to fetch from Anthropic' });
    }

    const data = await response.json();
    const textResponse = data.content?.[0]?.text;
    
    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ error: 'Failed to parse JSON from AI response' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
