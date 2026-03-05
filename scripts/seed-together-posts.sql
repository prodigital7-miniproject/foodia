-- ============================================================
-- 1) stores가 비어 있으면 아래 3건 먼저 실행 (FK용)
--    이미 stores 데이터가 있으면 이 블록은 건너뛰고 2)만 실행
-- ============================================================

INSERT INTO foodia.stores (google_place_id, name, category, address, is_deleted)
VALUES
  ('mock_store_1', '벌통골', '한식', '서울 성동구 왕십리로 123', false),
  ('mock_store_2', '달빛카페', '카페', '서울 성동구 뚝섬로 456', false),
  ('mock_store_3', '올리브키친', '양식', '서울 성동구 연무장길 789', false)
ON CONFLICT (google_place_id) DO NOTHING;

-- ============================================================
-- 2) together_posts Mock 데이터 10건 (쿼리 10개)
--    위 mock_store_1~3이 없으면 FK 오류가 납니다.
--    이미 있는 stores의 google_place_id로 바꿔서 사용하세요.
-- ============================================================

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_1', '점심 한 끼 같이 해요', '갈비탕 먹으러 가실 분 구해요. 12시쯤 출발 예정이에요', 'open', true);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_1', '비오는 날 국물 요리 같이', '날씨가 궂어서 뜨끈한 거 먹고 싶어요. 2명만 같이 와주세요', 'open', true);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_2', '노트북 작업하면서 커피 한잔', '각자 일 하면서 조용히 카페 가실 분. 오후 2시~6시 예상', 'open', true);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_2', '주말 브런치 메이트 구해요', '토요일 아침 여유 있게 브런치 하실 분 1~2명 구합니다', 'open', false);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_3', '리조또 시식 메이트', '리조또 두 종류 시켜서 나눠 먹을 분 구해요. 지금 바로 갈 수 있어요', 'open', true);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_3', '저녁 스테이크 같이 드실 분', '오늘 저녁 7시쯤 스테이크 코스 같이 먹을 분 2명 모집해요', 'open', true);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_1', '불고기 백반 점심 모임', '점심시간에 불고기 백반 먹으러 가요. 3명까지 환영', 'open', true);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_2', '티타임 디저트 나눠 먹어요', '케이크 두 개 시켜서 반씩 나눠 먹을 분. 오후 3시', 'open', true);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_3', '파스타 두 종류 나눠 먹기', '알리오랑 크림 중 하나씩 시켜서 둘 다 맛보기. 1명 구해요', 'open', false);

INSERT INTO foodia.together_posts (google_place_id, title, content, status, is_anonymous)
VALUES ('mock_store_1', '한정식 코스 같이 드실 분', '주말 점심 한정식 코스 같이 가실 분 2명 구합니다. 예약 가능해요', 'open', true);
