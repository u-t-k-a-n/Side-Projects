CREATE OR REPLACE FUNCTION insert_equipment_assignment() 
RETURNS trigger AS $$
BEGIN 
    IF (SELECT equipment_count
        FROM Equipments
        WHERE equipment_id = NEW.equipment_id) >= NEW.using_equipment_count THEN

        UPDATE Equipments
        SET equipment_count = equipment_count - NEW.using_equipment_count
        WHERE equipment_id = NEW.equipment_id;

        RAISE NOTICE 'Equipment assignment successful';

    ELSE
        RAISE EXCEPTION 'Equipment assignment failed';
    END IF;
RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_equipment_assignment_trigger
BEFORE INSERT ON Equipment_Assignments
FOR EACH ROW EXECUTE PROCEDURE insert_equipment_assignment();

--INSERT INTO Equipment_Assignments(equipment_id, course_id, using_equipment_count) VALUES(1, 1, 1);

CREATE OR REPLACE FUNCTION delete_equipment_assignment()
RETURNS trigger AS $$
BEGIN
    IF (OLD.using_equipment_count > 0) THEN
        UPDATE Equipments
        SET equipment_count = equipment_count + OLD.using_equipment_count
        WHERE equipment_id = OLD.equipment_id;

        RAISE NOTICE 'Equipment assignment successful';
    END IF;
RETURN OLD;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_equipment_assignment_trigger
AFTER DELETE ON Equipment_Assignments
FOR EACH ROW EXECUTE PROCEDURE delete_equipment_assignment();

--DELETE FROM Equipment_Assignments WHERE course_id = 1 AND equipment_id = 1;
    